import { normalizeVersionPath, parseCookieSameSite, parseCorsOrigins } from '@boilerplate/helpers';

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

const getEnvOptional = (key: string): string | undefined =>
  process.env[key] === undefined || process.env[key] === '' ? undefined : process.env[key];

/** Auth mode: no-mailer (signup disabled) when AUTH_MODE=admin_only or mailer not configured */
export const isNoMailerMode = (): boolean =>
  getEnvOptional('AUTH_MODE') === 'admin_only' || getEnvOptional('MAILER_ENABLED') !== 'true';

export const config = {
  port: Number.parseInt(getEnv('API_PORT'), 10),
  appName: getEnv('APP_NAME'),
  jwtSecret: getEnv('JWT_SECRET'),
  /** API version path prefix (e.g. /v1). Optional; set API_VERSION_PATH in env. */
  apiVersionPath: normalizeVersionPath(getEnvOptional('API_VERSION_PATH') ?? 'v1'),
  /** Access token expiry in seconds (JWT and cookie max-age). Required; e.g. 900 = 15m. */
  accessTokenMaxAgeSeconds: Number.parseInt(getEnv('JWT_ACCESS_EXPIRY_SECONDS'), 10),
  /** Refresh token cookie max-age in seconds (e.g. 604800 = 7d). Required. */
  refreshTokenMaxAgeSeconds: Number.parseInt(getEnv('JWT_REFRESH_EXPIRY_SECONDS'), 10),
  /** Cookie names for session (access) and refresh. Required. */
  sessionCookieName: getEnv('SESSION_COOKIE_NAME'),
  refreshCookieName: getEnv('REFRESH_COOKIE_NAME'),
  /** CORS allowed origins. Optional; empty/missing = allow all (dev). */
  corsOrigins: parseCorsOrigins(getEnvOptional('CORS_ORIGINS')),
  /** Secure cookies in production. */
  cookieSecure: process.env.NODE_ENV === 'production',
  /** SameSite: lax, strict, or none. Required. */
  cookieSameSite: parseCookieSameSite(getEnv('COOKIE_SAME_SITE'), 'COOKIE_SAME_SITE'),
};
