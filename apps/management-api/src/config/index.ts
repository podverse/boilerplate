const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

const getEnvOptional = (key: string): string | undefined =>
  process.env[key] === undefined || process.env[key] === '' ? undefined : process.env[key];

function normalizeVersionPath(raw: string): string {
  const s = raw.trim();
  const withLeading = s.startsWith('/') ? s : `/${s}`;
  return withLeading.endsWith('/') ? withLeading.slice(0, -1) : withLeading;
}

export const config = {
  port: Number.parseInt(getEnv('MANAGEMENT_API_PORT'), 10),
  appName: getEnv('MANAGEMENT_APP_NAME'),
  jwtSecret: getEnv('MANAGEMENT_JWT_SECRET'),
  apiVersionPath: normalizeVersionPath(getEnvOptional('MANAGEMENT_API_VERSION_PATH') ?? 'v1'),
  superAdminEmail: getEnvOptional('SUPER_ADMIN_EMAIL'),
  superAdminPassword: getEnvOptional('SUPER_ADMIN_PASSWORD'),
};
