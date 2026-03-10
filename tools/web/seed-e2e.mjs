#!/usr/bin/env node
/**
 * Deterministic E2E seed for web app: main DB (boilerplate_test).
 * Inserts fixed user, credentials, bio, buckets, and a password_reset token for E2E.
 * Run after make e2e_deps.
 * Uses test DB env defaults (DB_HOST, DB_PORT 5532, DB_NAME boilerplate_test, read_write/test).
 */
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pg from 'pg';

const DB_HOST = process.env.DB_HOST ?? 'localhost';
const DB_PORT = Number(process.env.DB_PORT ?? '5532', 10);
const DB_NAME = process.env.DB_NAME ?? 'boilerplate_test';
const DB_USER = process.env.DB_READ_WRITE_USERNAME ?? 'read_write';
const DB_PASSWORD = process.env.DB_READ_WRITE_PASSWORD ?? 'test';

const E2E_USER_ID = '11111111-1111-4111-a111-111111111111';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';
const E2E_BUCKET2_ID = '33333333-3333-4333-a333-333333333333';
const E2E_USER2_ID = '44444444-4444-4444-a444-444444444444';
const E2E_USER3_ID = '55555555-5555-4555-a555-555555555555';
const E2E_USER4_ID = '66666666-6666-4666-a666-666666666666';
const E2E_USER_SHORT_ID = 'e2eusr000001';
const E2E_USER2_SHORT_ID = 'e2eusr000002';
const E2E_USER3_SHORT_ID = 'e2eusr000003';
const E2E_USER4_SHORT_ID = 'e2eusr000004';
const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';
const E2E_BUCKET2_SHORT_ID = 'e2ebkt000002';
const E2E_EMAIL = 'e2e@example.com';
const E2E_EMAIL2 = 'e2e-admin2@example.com';
const E2E_EMAIL3 = 'e2e-admin-readonly@example.com';
const E2E_EMAIL4 = 'e2e-other@example.com';
const E2E_PASSWORD_PLAIN = 'Test!1Aa';
/** Raw token for reset-password E2E (short to avoid URL truncation); must match apps/web/e2e/helpers/resetPasswordToken.ts */
const E2E_RESET_PASSWORD_TOKEN_RAW = 'e2e0' + '0'.repeat(28);
const E2E_DISPLAY_NAME = 'E2E User';
const E2E_DISPLAY_NAME2 = 'E2E Admin Two';
const E2E_DISPLAY_NAME3 = 'E2E Admin Readonly';
const E2E_DISPLAY_NAME4 = 'E2E Other';
/** Full CRUD (create=1, read=2, update=4, delete=8) so admin can manage bucket admins. */
const BUCKET_CRUD_FULL = 15;
/** Read only; cannot manage bucket admins. */
const BUCKET_CRUD_READ = 2;

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
      `INSERT INTO "user" (id, short_id, email_verified_at, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW(), NOW())`,
      [E2E_USER2_ID, E2E_USER2_SHORT_ID]
    );
    await client.query(
      `INSERT INTO user_credentials (user_id, email, password_hash) VALUES ($1, $2, $3)`,
      [E2E_USER2_ID, E2E_EMAIL2, passwordHash]
    );
    await client.query(`INSERT INTO user_bio (user_id, display_name) VALUES ($1, $2)`, [
      E2E_USER2_ID,
      E2E_DISPLAY_NAME2,
    ]);
    await client.query(
      `INSERT INTO "user" (id, short_id, email_verified_at, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW(), NOW())`,
      [E2E_USER3_ID, E2E_USER3_SHORT_ID]
    );
    await client.query(
      `INSERT INTO user_credentials (user_id, email, password_hash) VALUES ($1, $2, $3)`,
      [E2E_USER3_ID, E2E_EMAIL3, passwordHash]
    );
    await client.query(`INSERT INTO user_bio (user_id, display_name) VALUES ($1, $2)`, [
      E2E_USER3_ID,
      E2E_DISPLAY_NAME3,
    ]);
    await client.query(
      `INSERT INTO "user" (id, short_id, email_verified_at, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW(), NOW())`,
      [E2E_USER4_ID, E2E_USER4_SHORT_ID]
    );
    await client.query(
      `INSERT INTO user_credentials (user_id, email, password_hash) VALUES ($1, $2, $3)`,
      [E2E_USER4_ID, E2E_EMAIL4, passwordHash]
    );
    await client.query(`INSERT INTO user_bio (user_id, display_name) VALUES ($1, $2)`, [
      E2E_USER4_ID,
      E2E_DISPLAY_NAME4,
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
    await client.query(
      `INSERT INTO bucket_admin (bucket_id, user_id, bucket_crud, bucket_messages_crud, bucket_admins_crud, created_at)
       VALUES ($1, $2, $3, 2, 2, NOW())`,
      [E2E_BUCKET1_ID, E2E_USER2_ID, BUCKET_CRUD_FULL]
    );
    await client.query(
      `INSERT INTO bucket_admin (bucket_id, user_id, bucket_crud, bucket_messages_crud, bucket_admins_crud, created_at)
       VALUES ($1, $2, $3, 2, 2, NOW())`,
      [E2E_BUCKET1_ID, E2E_USER3_ID, BUCKET_CRUD_READ]
    );
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(E2E_RESET_PASSWORD_TOKEN_RAW, 'utf8')
      .digest('hex');
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await client.query(
      `INSERT INTO verification_token (user_id, kind, token_hash, expires_at, payload)
       VALUES ($1, 'password_reset', $2, $3::timestamp, NULL)`,
      [E2E_USER_ID, resetTokenHash, resetExpiresAt]
    );
    console.log(
      'E2E web seed done: 4 users (owner, admin-with-permission, admin-without-permission, non-admin), 2 buckets, 2 bucket admins for E2E Bucket One.'
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('tools/web/seed-e2e.mjs:', err.message);
  process.exit(1);
});
