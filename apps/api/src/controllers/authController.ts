import type { Request, Response } from 'express';
import type { UserWithRelations } from '@boilerplate/orm';
import { AUTH_MESSAGE_INVALID_CREDENTIALS, validatePassword } from '@boilerplate/helpers';
import { getPasswordValidationMessages, resolveLocale } from '@boilerplate/helpers-i18n';
import { UserService, VerificationTokenService, RefreshTokenService } from '@boilerplate/orm';
import type {
  ChangePasswordBody,
  ForgotPasswordBody,
  LoginBody,
  RequestEmailChangeBody,
  ResetPasswordBody,
  SignupBody,
  WithOptionalToken,
} from '@boilerplate/helpers-requests';
import { config } from '../config/index.js';
import { hashPassword, comparePassword } from '../lib/auth/hash.js';
import { signAccessToken } from '../lib/auth/jwt.js';
import { setSessionCookies, clearSessionCookies } from '../lib/auth/cookies.js';
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

/**
 * Safe shape for user in API responses. Only these fields may be returned.
 * Never include credentials (e.g. passwordHash) or verification token hashes/raw tokens.
 */
export interface PublicUser {
  id: string;
  email: string;
  displayName: string | null;
}

/**
 * Single place to serialize a user for responses. Returns only safe, non-sensitive fields.
 * Never pass req.user or user.credentials directly to res.json().
 */
function userToJson(user: UserWithRelations): PublicUser {
  return {
    id: user.id,
    email: user.credentials.email,
    displayName: user.bio?.displayName ?? null,
  };
}

function getCookieOptions() {
  return {
    sessionCookieName: config.sessionCookieName,
    refreshCookieName: config.refreshCookieName,
    cookieSecure: config.cookieSecure,
    cookieSameSite: config.cookieSameSite,
    accessMaxAgeSeconds: config.accessTokenMaxAgeSeconds,
    refreshMaxAgeSeconds: config.refreshTokenMaxAgeSeconds,
  };
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginBody;

  const user = await UserService.findByEmail(email);
  if (user === null) {
    res.status(401).json({ message: AUTH_MESSAGE_INVALID_CREDENTIALS });
    return;
  }

  const ok = await comparePassword(password, user.credentials.passwordHash);
  if (!ok) {
    res.status(401).json({ message: AUTH_MESSAGE_INVALID_CREDENTIALS });
    return;
  }

  const jwtSecret = config.jwtSecret;
  const accessToken = signAccessToken(user, jwtSecret, config.accessTokenMaxAgeSeconds);
  const refreshRaw = generateToken();
  const refreshHash = hashToken(refreshRaw);
  const refreshExpiresAt = new Date(Date.now() + config.refreshTokenMaxAgeSeconds * 1000);
  await RefreshTokenService.createToken(user.id, refreshHash, refreshExpiresAt);

  setSessionCookies(res, accessToken, refreshRaw, getCookieOptions());
  res.status(200).json({ user: userToJson(user) });
}

export function logout(req: Request, res: Response): void {
  const refreshRaw = req.cookies?.[config.refreshCookieName];
  if (typeof refreshRaw === 'string' && refreshRaw !== '') {
    const refreshHash = hashToken(refreshRaw);
    void RefreshTokenService.revokeByTokenHash(refreshHash);
  }
  clearSessionCookies(res, getCookieOptions());
  res.status(204).send();
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshRaw = req.cookies?.[config.refreshCookieName];
  if (typeof refreshRaw !== 'string' || refreshRaw === '') {
    clearSessionCookies(res, getCookieOptions());
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const refreshHash = hashToken(refreshRaw);
  const user = await RefreshTokenService.consumeToken(refreshHash);
  if (user === null) {
    clearSessionCookies(res, getCookieOptions());
    res.status(401).json({ message: 'Invalid or expired session' });
    return;
  }
  const jwtSecret = config.jwtSecret;
  const accessToken = signAccessToken(user, jwtSecret, config.accessTokenMaxAgeSeconds);
  const newRefreshRaw = generateToken();
  const newRefreshHash = hashToken(newRefreshRaw);
  const refreshExpiresAt = new Date(Date.now() + config.refreshTokenMaxAgeSeconds * 1000);
  await RefreshTokenService.createToken(user.id, newRefreshHash, refreshExpiresAt);

  setSessionCookies(res, accessToken, newRefreshRaw, getCookieOptions());
  res.status(200).json({ user: userToJson(user) });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const { currentPassword, newPassword } = req.body as ChangePasswordBody;

  const locale = resolveLocale(req.get('Accept-Language'));
  const passwordCheck = validatePassword(newPassword, getPasswordValidationMessages(locale));
  if (!passwordCheck.valid) {
    res.status(400).json({ message: passwordCheck.message });
    return;
  }

  const ok = await comparePassword(currentPassword, user.credentials.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  const hashed = await hashPassword(newPassword);
  await UserService.updatePassword(user.id, hashed);

  res.status(204).send();
}

export async function signup(req: Request, res: Response): Promise<void> {
  const body = req.body as SignupBody;

  const locale = resolveLocale(req.get('Accept-Language'));
  const passwordCheck = validatePassword(body.password, getPasswordValidationMessages(locale));
  if (!passwordCheck.valid) {
    res.status(400).json({ message: passwordCheck.message });
    return;
  }

  const existing = await UserService.findByEmail(body.email);
  if (existing !== null) {
    res.status(201).json({ message: 'Registration complete.' });
    return;
  }

  const hashed = await hashPassword(body.password);
  const user = await UserService.create({
    email: body.email,
    password: hashed,
    displayName: body.displayName ?? null,
  });

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
      await sendVerificationEmail(user.credentials.email, rawToken, locale);
    } catch {
      // Continue; user is created, verification email best-effort
    }
  }

  const accessToken = signAccessToken(user, config.jwtSecret, config.accessTokenMaxAgeSeconds);
  const refreshRaw = generateToken();
  const refreshHash = hashToken(refreshRaw);
  const refreshExpiresAt = new Date(Date.now() + config.refreshTokenMaxAgeSeconds * 1000);
  await RefreshTokenService.createToken(user.id, refreshHash, refreshExpiresAt);

  setSessionCookies(res, accessToken, refreshRaw, getCookieOptions());
  res.status(201).json({ user: userToJson(user) });
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const token = (req.body as WithOptionalToken)?.token ?? (req.query as WithOptionalToken).token;
  if (token === undefined || typeof token !== 'string' || token === '') {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const tokenHash = hashToken(token);
  const consumed = await VerificationTokenService.consumeToken(tokenHash, 'email_verify');
  if (consumed === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  await UserService.setEmailVerifiedAt(consumed.user.id);
  res.status(200).json({ message: 'Email verified' });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { email } = req.body as ForgotPasswordBody;
  const locale = resolveLocale(req.get('Accept-Language'));
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
      await sendPasswordResetEmail(user.credentials.email, rawToken, locale);
    } catch {
      // No enumeration: still return success
    }
  }
  res.status(200).json({
    message: 'If an account exists with this email, you will receive a reset link.',
  });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, newPassword } = req.body as ResetPasswordBody;
  const tokenHash = hashToken(token);
  const consumed = await VerificationTokenService.consumeToken(tokenHash, 'password_reset');
  if (consumed === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const locale = resolveLocale(req.get('Accept-Language'));
  const passwordCheck = validatePassword(newPassword, getPasswordValidationMessages(locale));
  if (!passwordCheck.valid) {
    res.status(400).json({ message: passwordCheck.message });
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
  const { newEmail } = req.body as RequestEmailChangeBody;
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
    const locale = resolveLocale(req.get('Accept-Language'));
    await sendEmailChangeVerificationEmail(newEmail, rawToken, locale);
  } catch {
    res.status(500).json({ message: 'Failed to send verification email' });
    return;
  }
  res.status(200).json({ message: 'Verification email sent' });
}

export async function confirmEmailChange(req: Request, res: Response): Promise<void> {
  const token = (req.body as WithOptionalToken)?.token ?? (req.query as WithOptionalToken).token;
  if (token === undefined || typeof token !== 'string' || token === '') {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const tokenHash = hashToken(token);
  const consumed = await VerificationTokenService.consumeToken(tokenHash, 'email_change');
  if (consumed === null) {
    res.status(400).json({ message: 'Invalid or expired link' });
    return;
  }
  const pending =
    consumed.payload !== null && typeof consumed.payload.pending_email === 'string'
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
