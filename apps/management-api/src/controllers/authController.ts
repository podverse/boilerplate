import type { Request, Response } from 'express';
import { ManagementUserService } from '@boilerplate/management-orm';
import { comparePassword } from '../lib/auth/hash.js';
import { signManagementToken } from '../lib/auth/jwt.js';
import { managementUserToJson } from '../lib/managementUserToJson.js';

/**
 * Auth responses use managementUserToJson only. Never return req.managementUser or
 * user.credentials; passwordHash and raw tokens must not appear in any response.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };
  if (email === undefined || password === undefined) {
    res.status(400).json({ message: 'Email and password required' });
    return;
  }

  const user = await ManagementUserService.findByEmail(email);
  if (user === null) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const ok = await comparePassword(password, user.credentials.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const jwtSecret = process.env.MANAGEMENT_JWT_SECRET;
  if (jwtSecret === undefined) {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  const token = signManagementToken(user, jwtSecret);
  res.status(200).json({
    token,
    user: managementUserToJson(user),
  });
}

export function me(req: Request, res: Response): void {
  const user = req.managementUser;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  res.status(200).json({ user: managementUserToJson(user) });
}
