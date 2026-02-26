import type { Request, Response } from 'express';
import type { UserWithRelations } from '@boilerplate/orm';
import { UserService, VerificationTokenService } from '@boilerplate/orm';
import { hashPassword, comparePassword } from '../lib/auth/hash.js';
import { signToken } from '../lib/auth/jwt.js';
import {
  generateToken,
  hashToken,
  getEmailVerifyExpiry,
  getPasswordResetExpiry,
  getEmailChangeExpiry,
} from '../lib/auth/verification-token.js';
import {
  isMailerEnabled,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEmailChangeVerificationEmail,
} from '../lib/mailer/send.js';

function userToJson(user: UserWithRelations) {
  return {
    id: user.id,
    email: user.credentials.email,
    displayName: user.bio?.displayName ?? null,
  };
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (email === undefined || password === undefined) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  const user = await UserService.findByEmail(email);
  if (user === null) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const ok = await comparePassword(password, user.credentials.password);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret === undefined) {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  const token = signToken(user, jwtSecret);
  res.status(200).json({
    token,
    user: userToJson(user),
  });
}

export function logout(_req: Request, res: Response): void {
  res.status(204).send();
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  if (currentPassword === undefined || newPassword === undefined) {
    res.status(400).json({ message: 'currentPassword and newPassword required' });
    return;
  }

  const ok = await comparePassword(currentPassword, user.credentials.password);
  if (!ok) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  const hashed = await hashPassword(newPassword);
  await UserService.updatePassword(user.id, hashed);

  res.status(204).send();
}

export async function signup(req: Request, res: Response): Promise<void> {
  const { email, password, displayName } = req.body as {
    email?: string;
    password?: string;
    displayName?: string;
  };
  if (email === undefined || password === undefined) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  const existing = await UserService.findByEmail(email);
  if (existing !== null) {
    res.status(201).json({ message: 'Registration complete.' });
    return;
  }

  const hashed = await hashPassword(password);
  const user = await UserService.create({
    email,
    password: hashed,
    displayName: displayName ?? null,
  });

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret === undefined) {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  if (isMailerEnabled()) {
    try {
      const rawToken = generateToken();
      const tokenHash = hashToken(rawToken);
      await VerificationTokenService.createToken(
        user.id,
        'email_verify',
        tokenHash,
        getEmailVerifyExpiry(),
        null
      );
      await sendVerificationEmail(user.credentials.email, rawToken);
    } catch {
      // Continue; user is created, verification email best-effort
    }
  }

  const token = signToken(user, jwtSecret);
  res.status(201).json({
    token,
    user: userToJson(user),
  });
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const token =
    (req.body as { token?: string })?.token ??
    (req.query as { token?: string }).token;
  if (token === undefined || typeof token !== 'string' || token === '') {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const tokenHash = hashToken(token);
  const consumed = await VerificationTokenService.consumeToken(
    tokenHash,
    'email_verify'
  );
  if (consumed === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  await UserService.setEmailVerifiedAt(consumed.user.id);
  res.status(200).json({ message: 'Email verified' });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const email = (req.body as { email?: string })?.email;
  if (email === undefined || typeof email !== 'string' || email === '') {
    res.status(400).json({ message: 'Email required' });
    return;
  }
  const user = await UserService.findByEmail(email);
  if (user !== null) {
    try {
      const rawToken = generateToken();
      const tokenHash = hashToken(rawToken);
      await VerificationTokenService.createToken(
        user.id,
        'password_reset',
        tokenHash,
        getPasswordResetExpiry(),
        null
      );
      await sendPasswordResetEmail(user.credentials.email, rawToken);
    } catch {
      // No enumeration: still return success
    }
  }
  res.status(200).json({
    message: 'If an account exists with this email, you will receive a reset link.',
  });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };
  if (
    token === undefined ||
    typeof token !== 'string' ||
    token === '' ||
    newPassword === undefined ||
    typeof newPassword !== 'string' ||
    newPassword.length < 1
  ) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const tokenHash = hashToken(token);
  const consumed = await VerificationTokenService.consumeToken(
    tokenHash,
    'password_reset'
  );
  if (consumed === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const hashed = await hashPassword(newPassword);
  await UserService.updatePassword(consumed.user.id, hashed);
  res.status(204).send();
}

export async function requestEmailChange(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const newEmail = (req.body as { newEmail?: string })?.newEmail;
  if (newEmail === undefined || typeof newEmail !== 'string' || newEmail === '') {
    res.status(400).json({ message: 'newEmail required' });
    return;
  }
  if (newEmail === user.credentials.email) {
    res.status(400).json({ message: 'New email must differ from current' });
    return;
  }
  const existing = await UserService.findByEmail(newEmail);
  if (existing !== null) {
    res.status(409).json({ message: 'Email already in use' });
    return;
  }
  try {
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    await VerificationTokenService.createToken(
      user.id,
      'email_change',
      tokenHash,
      getEmailChangeExpiry(),
      { pending_email: newEmail }
    );
    await sendEmailChangeVerificationEmail(newEmail, rawToken);
  } catch {
    res.status(500).json({ message: 'Failed to send verification email' });
    return;
  }
  res.status(200).json({ message: 'Verification email sent' });
}

export async function confirmEmailChange(req: Request, res: Response): Promise<void> {
  const token =
    (req.body as { token?: string })?.token ??
    (req.query as { token?: string }).token;
  if (token === undefined || typeof token !== 'string' || token === '') {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const tokenHash = hashToken(token);
  const consumed = await VerificationTokenService.consumeToken(
    tokenHash,
    'email_change'
  );
  if (consumed === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const pending =
    consumed.payload !== null &&
    typeof consumed.payload.pending_email === 'string'
      ? consumed.payload.pending_email
      : null;
  if (pending === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  await UserService.updateEmail(consumed.user.id, pending);
  await UserService.setEmailVerifiedAt(consumed.user.id);
  res.status(200).json({ message: 'Email updated' });
}

export function me(req: Request, res: Response): void {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  res.status(200).json({ user: userToJson(user) });
}
