/**
 * Reusable startup/config helpers for CORS and cookie options.
 * Shared by API and management-api config.
 */

export type CookieSameSite = 'lax' | 'strict' | 'none';

/**
 * Options required to set or clear session/refresh cookies (names and flags).
 * Use for clearSessionCookies or when building Set-Cookie headers. Apps can extend
 * with accessMaxAgeSeconds/refreshMaxAgeSeconds for setSessionCookies.
 */
export interface SessionCookieOptions {
  sessionCookieName: string;
  refreshCookieName: string;
  cookieSecure: boolean;
  cookieSameSite: CookieSameSite;
}

const COOKIE_SAME_SITE_VALUES: CookieSameSite[] = ['lax', 'strict', 'none'];

/**
 * Parses a comma-separated CORS origins string. Returns undefined when raw is
 * missing or empty (caller may treat as "allow all").
 */
export function parseCorsOrigins(raw: string | undefined): string[] | undefined {
  if (raw === undefined || raw.trim() === '') return undefined;
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parses and validates a Cookie SameSite value. Returns the typed value or throws.
 * @param value - The env value (e.g. from getEnv('COOKIE_SAME_SITE'))
 * @param varName - Optional env var name for the error message (e.g. 'COOKIE_SAME_SITE', 'MANAGEMENT_COOKIE_SAME_SITE')
 */
export function parseCookieSameSite(value: string, varName = 'COOKIE_SAME_SITE'): CookieSameSite {
  const normalized = value.trim().toLowerCase();
  if (COOKIE_SAME_SITE_VALUES.includes(normalized as CookieSameSite)) {
    return normalized as CookieSameSite;
  }
  throw new Error(`Invalid ${varName}: "${value}". Must be lax, strict, or none.`);
}
