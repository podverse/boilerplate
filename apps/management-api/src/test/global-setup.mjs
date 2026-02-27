/**
 * Vitest globalSetup: truncate management and main app tables so each test run starts clean.
 * Runs once before any test file. Requires both management and main test DBs to exist and be initialized.
 */
import pg from 'pg';

const mainEnv = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? '5532', 10),
  database: process.env.DB_NAME ?? 'boilerplate_test',
  user: process.env.DB_READ_WRITE_USERNAME ?? 'read_write',
  password: process.env.DB_READ_WRITE_PASSWORD ?? 'test',
};

const managementEnv = {
  host: process.env.MANAGEMENT_DB_HOST ?? 'localhost',
  port: Number(process.env.MANAGEMENT_DB_PORT ?? '5532', 10),
  database: process.env.MANAGEMENT_DB_NAME ?? 'boilerplate_management_test',
  user: process.env.MANAGEMENT_DB_USERNAME ?? 'read_write',
  password: process.env.MANAGEMENT_DB_PASSWORD ?? 'test',
};

export default async function globalSetup() {
  const mainClient = new pg.Client(mainEnv);
  const managementClient = new pg.Client(managementEnv);
  try {
    await mainClient.connect();
    await mainClient.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
  } catch (err) {
    console.error('global-setup (main DB): failed to truncate:', err.message);
    throw err;
  } finally {
    await mainClient.end();
  }
  try {
    await managementClient.connect();
    await managementClient.query('TRUNCATE management_event;');
    await managementClient.query('TRUNCATE management_user CASCADE;');
  } catch (err) {
    console.error('global-setup (management DB): failed to truncate:', err.message);
    throw err;
  } finally {
    await managementClient.end();
  }
}
