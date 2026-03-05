#!/usr/bin/env node
/**
 * Deterministic E2E seed for web app: main DB (boilerplate_test).
 * Inserts fixed user, credentials, bio, and buckets. Run after make e2e_deps.
 * Uses test DB env defaults (DB_HOST, DB_PORT 5532, DB_NAME boilerplate_test, read_write/test).
 */
import bcrypt from 'bcrypt';
import pg from 'pg';

const DB_HOST = process.env.DB_HOST ?? 'localhost';
const DB_PORT = Number(process.env.DB_PORT ?? '5532', 10);
const DB_NAME = process.env.DB_NAME ?? 'boilerplate_test';
const DB_USER = process.env.DB_READ_WRITE_USERNAME ?? 'read_write';
const DB_PASSWORD = process.env.DB_READ_WRITE_PASSWORD ?? 'test';

const E2E_USER_ID = '11111111-1111-4111-a111-111111111111';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';
const E2E_BUCKET2_ID = '33333333-3333-4333-a333-333333333333';
const E2E_USER_SHORT_ID = 'e2euser000001';
const E2E_BUCKET1_SHORT_ID = 'e2ebucket00001';
const E2E_BUCKET2_SHORT_ID = 'e2ebucket00002';
const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD_PLAIN = 'Test!1Aa';
const E2E_DISPLAY_NAME = 'E2E User';

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
    await client.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');
    await client.query(
      `INSERT INTO "user" (id, short_id, email_verified_at, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW(), NOW())`,
      [E2E_USER_ID, E2E_USER_SHORT_ID]
    );
    await client.query(
      `INSERT INTO user_credentials (user_id, email, password_hash) VALUES ($1, $2, $3)`,
      [E2E_USER_ID, E2E_EMAIL, passwordHash]
    );
    await client.query(`INSERT INTO user_bio (user_id, display_name) VALUES ($1, $2)`, [
      E2E_USER_ID,
      E2E_DISPLAY_NAME,
    ]);
    await client.query(
      `INSERT INTO bucket (id, owner_id, name, is_public, parent_bucket_id, short_id, created_at, updated_at)
       VALUES ($1, $2, 'E2E Bucket One', true, NULL, $3, NOW(), NOW())`,
      [E2E_BUCKET1_ID, E2E_USER_ID, E2E_BUCKET1_SHORT_ID]
    );
    await client.query(
      `INSERT INTO bucket (id, owner_id, name, is_public, parent_bucket_id, short_id, created_at, updated_at)
       VALUES ($1, $2, 'E2E Bucket Two', false, NULL, $3, NOW(), NOW())`,
      [E2E_BUCKET2_ID, E2E_USER_ID, E2E_BUCKET2_SHORT_ID]
    );
    console.log('E2E web seed done: 1 user (e2e@example.com), 2 buckets.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('tools/web/seed-e2e.mjs:', err.message);
  process.exit(1);
});
