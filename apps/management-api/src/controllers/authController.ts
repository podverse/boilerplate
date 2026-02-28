import type { Request, Response } from 'express';
import { AUTH_MESSAGE_INVALID_CREDENTIALS } from '@boilerplate/helpers';
import { ManagementRefreshTokenService, ManagementUserService } from '@boilerplate/management-orm';
import { config } from '../config/index.js';
import { setSessionCookies, clearSessionCookies } from '../lib/auth/cookies.js';
import { comparePassword } from '../lib/auth/hash.js';
import { generateToken, hashToken } from '../lib/auth/refresh-token.js';
import { signManagementAccessToken } from '../lib/auth/jwt.js';
import { managementUserToJson } from '../lib/managementUserToJson.js';

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
    res.status(401).json({ message: AUTH_MESSAGE_INVALID_CREDENTIALS });
    return;
  }

  const ok = await comparePassword(password, user.credentials.passwordHash);
  if (!ok) {
    res.status(401).json({ message: AUTH_MESSAGE_INVALID_CREDENTIALS });
    return;
  }

  const jwtSecret = config.jwtSecret;
  const accessToken = signManagementAccessToken(user, jwtSecret, config.accessTokenMaxAgeSeconds);
  const refreshRaw = generateToken();
  const refreshHash = hashToken(refreshRaw);
  const refreshExpiresAt = new Date(Date.now() + config.refreshTokenMaxAgeSeconds * 1000);
  await ManagementRefreshTokenService.createToken(user.id, refreshHash, refreshExpiresAt);

  setSessionCookies(res, accessToken, refreshRaw, getCookieOptions());
  res.status(200).json({ user: managementUserToJson(user) });
}

export function logout(req: Request, res: Response): void {
  const refreshRaw = req.cookies?.[config.refreshCookieName];
  if (typeof refreshRaw === 'string' && refreshRaw !== '') {
    const refreshHash = hashToken(refreshRaw);
    void ManagementRefreshTokenService.revokeByTokenHash(refreshHash);
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
  const user = await ManagementRefreshTokenService.consumeToken(refreshHash);
  if (user === null) {
    clearSessionCookies(res, getCookieOptions());
    res.status(401).json({ message: 'Invalid or expired session' });
    return;
  }
  const jwtSecret = config.jwtSecret;
  const accessToken = signManagementAccessToken(user, jwtSecret, config.accessTokenMaxAgeSeconds);
  const newRefreshRaw = generateToken();
  const newRefreshHash = hashToken(newRefreshRaw);
  const refreshExpiresAt = new Date(Date.now() + config.refreshTokenMaxAgeSeconds * 1000);
  await ManagementRefreshTokenService.createToken(user.id, newRefreshHash, refreshExpiresAt);

  setSessionCookies(res, accessToken, newRefreshRaw, getCookieOptions());
  res.status(200).json({ user: managementUserToJson(user) });
}

export function me(req: Request, res: Response): void {
  const user = req.managementUser;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  res.status(200).json({ user: managementUserToJson(user) });
}
