import type { CookieSameSite } from '@boilerplate/helpers';
import type { Response } from 'express';

export interface CookieOptions {
  sessionCookieName: string;
  refreshCookieName: string;
  cookieSecure: boolean;
  cookieSameSite: CookieSameSite;
  /** Access token max-age in seconds (align with JWT expiry). */
  accessMaxAgeSeconds: number;
  /** Refresh token max-age in seconds. */
  refreshMaxAgeSeconds: number;
}

/**
 * Set HTTP-only session (access) and refresh cookies. Never send tokens in response body for browser clients.
 */
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

/**
 * Clear session and refresh cookies (e.g. on logout or invalid refresh).
 */
export function clearSessionCookies(res: Response, options: Pick<CookieOptions, 'sessionCookieName' | 'refreshCookieName' | 'cookieSecure' | 'cookieSameSite'>): void {
  const sameSite = options.cookieSameSite;
  const secure = options.cookieSecure;
  const clearOpts = `Path=/; Max-Age=0; HttpOnly; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', [
    `${options.sessionCookieName}=; ${clearOpts}`,
    `${options.refreshCookieName}=; ${clearOpts}`,
  ]);
}
