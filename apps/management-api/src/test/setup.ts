/**
 * Vitest setup: set test env before any module that reads process.env is loaded.
 * Uses dedicated test databases (main and management). Create both test DBs and run
 * init scripts before running tests (see AGENTS.md). Default ports 5532 (Postgres).
 * All values are hardcoded so test runs are deterministic and not affected by ambient env.
 */
const testEnv: Record<string, string> = {
  NODE_ENV: 'test',
  AUTH_MODE: 'admin_only_username',
  MANAGEMENT_API_PORT: '4100',
  BRAND_NAME: 'boilerplate-management-api-test',
  MANAGEMENT_JWT_SECRET: 'test-management-jwt-secret-min-32-chars-long',
  MANAGEMENT_SESSION_COOKIE_NAME: 'management_session',
  MANAGEMENT_REFRESH_COOKIE_NAME: 'management_refresh',
  MANAGEMENT_JWT_ACCESS_EXPIRY_SECONDS: '900',
  MANAGEMENT_JWT_REFRESH_EXPIRY_SECONDS: '604800',
  USER_INVITATION_TTL_HOURS: '24',
  MANAGEMENT_COOKIE_SAME_SITE: 'lax',
  MANAGEMENT_DB_HOST: 'localhost',
  MANAGEMENT_DB_PORT: '5532',
  MANAGEMENT_DB_NAME: 'boilerplate_management_test',
  MANAGEMENT_DB_USERNAME: 'read_write',
  MANAGEMENT_DB_PASSWORD: 'test',
  DB_HOST: 'localhost',
  DB_PORT: '5532',
  DB_NAME: 'boilerplate_test',
  DB_READ_USERNAME: 'read',
  DB_READ_PASSWORD: 'test',
  DB_READ_WRITE_USERNAME: 'read_write',
  DB_READ_WRITE_PASSWORD: 'test',
};

for (const [key, value] of Object.entries(testEnv)) {
  process.env[key] = value;
}
