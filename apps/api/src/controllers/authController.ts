import type { Request, Response } from 'express';
import { UserService } from '@boilerplate/orm';
import { hashPassword, comparePassword } from '../lib/auth/hash.js';
import { signToken } from '../lib/auth/jwt.js';

function userToJson(user: { id: string; email: string; displayName: string | null }) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
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

  const ok = await comparePassword(password, user.password);
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

  const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
  if (currentPassword === undefined || newPassword === undefined) {
    res.status(400).json({ message: 'currentPassword and newPassword required' });
    return;
  }

  const ok = await comparePassword(currentPassword, user.password);
  if (!ok) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  const hashed = await hashPassword(newPassword);
  await UserService.updatePassword(user.id, hashed);

  res.status(204).send();
}

export async function signup(req: Request, res: Response): Promise<void> {
  const { email, password, displayName } = req.body as { email?: string; password?: string; displayName?: string };
  if (email === undefined || password === undefined) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  const existing = await UserService.findByEmail(email);
  if (existing !== null) {
    res.status(409).json({ message: 'Email already registered' });
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

  const token = signToken(user, jwtSecret);
  res.status(201).json({
    token,
    user: userToJson(user),
  });
}

export function me(req: Request, res: Response): void {
  const user = req.user;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  res.status(200).json({ user: userToJson(user) });
}
