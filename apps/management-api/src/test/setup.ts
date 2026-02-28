/**
 * Vitest setup: set test env before any module that reads process.env is loaded.
 * Uses dedicated test databases (main and management). Create both test DBs and run
 * init scripts before running tests (see AGENTS.md). Default ports 5532 (Postgres).
 */
const testEnv: Record<string, string> = {
  NODE_ENV: 'test',
  MANAGEMENT_API_PORT: '4100',
  MANAGEMENT_APP_NAME: 'boilerplate-management-api-test',
  MANAGEMENT_JWT_SECRET: 'test-management-jwt-secret-min-32-chars-long',
  MANAGEMENT_SESSION_COOKIE_NAME: 'management_session',
  MANAGEMENT_REFRESH_COOKIE_NAME: 'management_refresh',
  MANAGEMENT_JWT_ACCESS_EXPIRY_SECONDS: '900',
  MANAGEMENT_JWT_REFRESH_EXPIRY_SECONDS: '604800',
  MANAGEMENT_COOKIE_SAME_SITE: 'lax',
  MANAGEMENT_DB_HOST: process.env.MANAGEMENT_DB_HOST ?? 'localhost',
  MANAGEMENT_DB_PORT: process.env.MANAGEMENT_DB_PORT ?? '5532',
  MANAGEMENT_DB_NAME: process.env.MANAGEMENT_DB_NAME ?? 'boilerplate_management_test',
  MANAGEMENT_DB_USERNAME: process.env.MANAGEMENT_DB_USERNAME ?? 'read_write',
  MANAGEMENT_DB_PASSWORD: process.env.MANAGEMENT_DB_PASSWORD ?? 'test',
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: process.env.DB_PORT ?? '5532',
  DB_NAME: process.env.DB_NAME ?? 'boilerplate_test',
  DB_READ_WRITE_USERNAME: process.env.DB_READ_WRITE_USERNAME ?? 'read_write',
  DB_READ_WRITE_PASSWORD: process.env.DB_READ_WRITE_PASSWORD ?? 'test',
};

for (const [key, value] of Object.entries(testEnv)) {
  if (process.env[key] === undefined || process.env[key] === '') {
    process.env[key] = value;
  }
}
