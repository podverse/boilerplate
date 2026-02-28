import type { CookieSameSite } from '@boilerplate/helpers';
import type { Response } from 'express';

export interface CookieOptions {
  sessionCookieName: string;
  refreshCookieName: string;
  cookieSecure: boolean;
  cookieSameSite: CookieSameSite;
  accessMaxAgeSeconds: number;
  refreshMaxAgeSeconds: number;
}

export function setSessionCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  options: CookieOptions
): void {
  const sameSite = options.cookieSameSite;
  const secure = options.cookieSecure;
  const sessionOpts = `Path=/; Max-Age=${options.accessMaxAgeSeconds}; HttpOnly; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
  const refreshOpts = `Path=/; Max-Age=${options.refreshMaxAgeSeconds}; HttpOnly; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', [
    `${options.sessionCookieName}=${encodeURIComponent(accessToken)}; ${sessionOpts}`,
    `${options.refreshCookieName}=${encodeURIComponent(refreshToken)}; ${refreshOpts}`,
  ]);
}

export function clearSessionCookies(
  res: Response,
  options: Pick<CookieOptions, 'sessionCookieName' | 'refreshCookieName' | 'cookieSecure' | 'cookieSameSite'>
): void {
  const sameSite = options.cookieSameSite;
  const secure = options.cookieSecure;
  const clearOpts = `Path=/; Max-Age=0; HttpOnly; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', [
    `${options.sessionCookieName}=; ${clearOpts}`,
    `${options.refreshCookieName}=; ${clearOpts}`,
  ]);
}
