const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

export const config = {
  port: Number.parseInt(getEnv('API_PORT'), 10),
  appName: getEnv('APP_NAME'),
};
