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
  getEnvOptional('AUTH_MODE') === 'admin_only' ||
  getEnvOptional('MAILER_ENABLED') !== 'true';

export const config = {
  port: Number.parseInt(getEnv('API_PORT'), 10),
  appName: getEnv('APP_NAME'),
  jwtSecret: getEnv('JWT_SECRET'),
};
