#!/usr/bin/env node
/**
 * Deterministic E2E seed for management-web: management DB (boilerplate_management_test).
 * Inserts fixed super admin and optional admin. Run after make e2e_deps.
 * Uses test DB env defaults (MANAGEMENT_DB_* or localhost, 5532, boilerplate_management_test, read_write/test).
 */
import bcrypt from 'bcrypt';
import pg from 'pg';

const DB_HOST = process.env.MANAGEMENT_DB_HOST ?? process.env.DB_HOST ?? 'localhost';
const DB_PORT = Number(process.env.MANAGEMENT_DB_PORT ?? process.env.DB_PORT ?? '5532', 10);
const DB_NAME = process.env.MANAGEMENT_DB_NAME ?? 'boilerplate_management_test';
const DB_USER =
  process.env.MANAGEMENT_DB_USERNAME ?? process.env.DB_READ_WRITE_USERNAME ?? 'read_write';
const DB_PASSWORD =
  process.env.MANAGEMENT_DB_PASSWORD ?? process.env.DB_READ_WRITE_PASSWORD ?? 'test';

const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const E2E_SUPER_ADMIN_EMAIL = 'e2e-superadmin@example.com';
const E2E_PASSWORD_PLAIN = 'Test!1Aa';
const E2E_DISPLAY_NAME = 'E2E Super Admin';

async function main() {
  const passwordHash = await bcrypt.hash(E2E_PASSWORD_PLAIN, 10);
  const client = new pg.Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await client.connect();
  try {
    await client.query('TRUNCATE management_event;');
    await client.query('TRUNCATE management_user CASCADE;');
    await client.query(
      `INSERT INTO management_user (id, is_super_admin, created_at, created_by)
       VALUES ($1, true, NOW(), NULL)`,
      [E2E_SUPER_ADMIN_ID]
    );
    await client.query(
      `INSERT INTO management_user_credentials (management_user_id, email, password_hash)
       VALUES ($1, $2, $3)`,
      [E2E_SUPER_ADMIN_ID, E2E_SUPER_ADMIN_EMAIL, passwordHash]
    );
    await client.query(
      `INSERT INTO management_user_bio (management_user_id, display_name) VALUES ($1, $2)`,
      [E2E_SUPER_ADMIN_ID, E2E_DISPLAY_NAME]
    );
    await client.query(
      `INSERT INTO admin_permissions (admin_id, admins_crud, users_crud, buckets_crud, bucket_messages_crud, bucket_admins_crud, event_visibility)
       VALUES ($1, 15, 15, 15, 15, 15, 'all')`,
      [E2E_SUPER_ADMIN_ID]
    );
    console.log('E2E management-web seed done: 1 super admin (e2e-superadmin@example.com).');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('tools/management-web/seed-e2e.mjs:', err.message);
  process.exit(1);
});
