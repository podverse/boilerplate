import { TEST_JWT_SECRET_API } from '@boilerplate/helpers';

/**
 * Vitest setup: set test env before any module that reads process.env (config, orm) is loaded.
 * Uses a dedicated test database (DB_NAME). Create the test DB and run
 * infra/database/combined/init_database.sql before running tests (see AGENTS.md).
 * Each test run starts with a clean DB: globalSetup (global-setup.mjs) truncates app tables before any test file.
 * Default ports 5532 (Postgres) and 6479 (Valkey) avoid conflict with Podverse monorepo (5432, 6379).
 * All values are hardcoded so test runs are deterministic and not affected by ambient env.
 */
const testEnv: Record<string, string> = {
  NODE_ENV: 'test',
  API_PORT: '3999',
  BRAND_NAME: 'boilerplate-api-test',
  AUTH_MODE: 'admin_only_username',
  JWT_SECRET: TEST_JWT_SECRET_API,
  SESSION_COOKIE_NAME: 'session',
  REFRESH_COOKIE_NAME: 'refresh',
  JWT_ACCESS_EXPIRY_SECONDS: '900',
  JWT_REFRESH_EXPIRY_SECONDS: '604800',
  COOKIE_SAME_SITE: 'lax',
  DB_HOST: 'localhost',
  DB_PORT: '5532',
  DB_NAME: 'boilerplate_test',
  DB_READ_USERNAME: 'read',
  DB_READ_PASSWORD: 'test',
  DB_READ_WRITE_USERNAME: 'read_write',
  DB_READ_WRITE_PASSWORD: 'test',
  VALKEY_HOST: 'localhost',
  VALKEY_PORT: '6479',
  VALKEY_PASSWORD: 'test',
};

for (const [key, value] of Object.entries(testEnv)) {
  process.env[key] = value;
}
