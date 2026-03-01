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

export const config = {
  port: Number.parseInt(getEnv('MANAGEMENT_API_PORT'), 10),
  appName: getEnv('MANAGEMENT_APP_NAME'),
  jwtSecret: getEnv('MANAGEMENT_JWT_SECRET'),
  apiVersionPath: normalizeVersionPath(getEnvOptional('MANAGEMENT_API_VERSION_PATH') ?? 'v1'),
  /** Access token expiry in seconds (JWT and cookie max-age). Required; e.g. 900 = 15m. */
  accessTokenMaxAgeSeconds: Number.parseInt(getEnv('MANAGEMENT_JWT_ACCESS_EXPIRY_SECONDS'), 10),
  refreshTokenMaxAgeSeconds: Number.parseInt(getEnv('MANAGEMENT_JWT_REFRESH_EXPIRY_SECONDS'), 10),
  sessionCookieName: getEnv('MANAGEMENT_SESSION_COOKIE_NAME'),
  refreshCookieName: getEnv('MANAGEMENT_REFRESH_COOKIE_NAME'),
  corsOrigins: parseCorsOrigins(getEnvOptional('MANAGEMENT_CORS_ORIGINS')),
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: parseCookieSameSite(
    getEnv('MANAGEMENT_COOKIE_SAME_SITE'),
    'MANAGEMENT_COOKIE_SAME_SITE'
  ),
};
