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

/** Normalize version path: leading slash, no trailing slash (e.g. "v1" -> "/v1"). */
function normalizeVersionPath(raw: string): string {
  const s = raw.trim();
  const withLeading = s.startsWith('/') ? s : `/${s}`;
  return withLeading.endsWith('/') ? withLeading.slice(0, -1) : withLeading;
}

export const config = {
  port: Number.parseInt(getEnv('API_PORT'), 10),
  appName: getEnv('APP_NAME'),
  jwtSecret: getEnv('JWT_SECRET'),
  /** API version path prefix (e.g. /v1). Defaults to /v1 when API_VERSION_PATH is unset. */
  apiVersionPath: normalizeVersionPath(getEnvOptional('API_VERSION_PATH') ?? 'v1'),
};
