/**
 * Vitest globalSetup: truncate app tables so each test run starts with a clean DB.
 * Runs once before any test file. Uses same test env defaults as setup.ts (this
 * process does not run setupFiles). Requires Postgres and test DB to exist (e.g. make test_deps).
 */
import pg from 'pg';

const testEnv = {
  DB_HOST: 'localhost',
  DB_PORT: '5532',
  DB_NAME: 'boilerplate_test',
  DB_READ_WRITE_USERNAME: 'read_write',
  DB_READ_WRITE_PASSWORD: 'test',
};

for (const [key, value] of Object.entries(testEnv)) {
  if (process.env[key] === undefined || process.env[key] === '') {
    process.env[key] = value;
  }
}

export default async function globalSetup() {
  const client = new pg.Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_READ_WRITE_USERNAME,
    password: process.env.DB_READ_WRITE_PASSWORD,
  });
  try {
    await client.connect();
    await client.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
  } catch (err) {
    console.error('global-setup: failed to truncate test database:', err.message);
    throw err;
  } finally {
    await client.end();
  }
}
