/**
 * Interactive script to create the super admin user in the management database.
 * Used during infra up (make local_infra_up). Prompts for email, generates a secure
 * password, creates the user, and prints the password once with instructions.
 *
 * Run from repo root: node scripts/management-api/create-super-admin.mjs
 *
 * Loads .env from apps/management-api (MANAGEMENT_DB_*). If stdin is not a TTY,
 * uses default email (superadmin@example.com) and still creates user if none exists.
 *
 * Local-only: when LOCAL_SUPERADMIN_PASSWORD is set (e.g. by Make), creates
 * superadmin@example.com with that password (insecure; local dev only).
 */
import { createInterface } from 'readline';
import { randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

async function loadEnv() {
  const dotenv = await import('dotenv');
  const envPath = path.join(repoRoot, 'apps', 'management-api', '.env');
  dotenv.config({ path: envPath });
}

function readLine(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const DEFAULT_EMAIL = 'superadmin@example.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

async function promptEmail() {
  const isTty = process.stdin.isTTY === true;

  const blurb = [
    '',
    'The super admin is the initial management user with full access (admins, users, settings).',
    'You will be prompted for an email; a strong password will be generated and shown once.',
    '',
  ].join('\n');

  if (isTty) {
    process.stdout.write(blurb);
    const raw = await readLine(`Email for super admin (blank = ${DEFAULT_EMAIL}): `);
    const email = raw === '' ? DEFAULT_EMAIL : raw;
    if (!isValidEmail(email)) {
      console.error(
        'Invalid email. Use a valid address or leave blank for superadmin@example.com.'
      );
      process.exit(1);
    }
    return email;
  }

  return DEFAULT_EMAIL;
}

function generatePassword() {
  return randomBytes(24)
    .toString('base64')
    .replace(/[/+=]/g, (c) => {
      const map = { '/': '_', '+': '-', '=': '' };
      return map[c] ?? c;
    });
}

async function main() {
  await loadEnv();

  const host = process.env.MANAGEMENT_DB_HOST;
  const port = process.env.MANAGEMENT_DB_PORT ?? '5532';
  const database = process.env.MANAGEMENT_DB_NAME;
  const user = process.env.MANAGEMENT_DB_USERNAME;
  const password = process.env.MANAGEMENT_DB_PASSWORD;

  if (!host || !database || !user) {
    console.error(
      'Missing MANAGEMENT_DB_HOST, MANAGEMENT_DB_NAME, or MANAGEMENT_DB_USERNAME. Set apps/management-api/.env (e.g. from .env.example or make env_setup).'
    );
    process.exit(1);
  }

  const localPassword = process.env.LOCAL_SUPERADMIN_PASSWORD;
  const email =
    typeof localPassword === 'string' && localPassword.length > 0
      ? DEFAULT_EMAIL
      : await promptEmail();
  const plainPassword =
    typeof localPassword === 'string' && localPassword.length > 0
      ? localPassword
      : generatePassword();

  const bcrypt = (await import('bcrypt')).default;
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const { v4: uuidv4 } = await import('uuid');
  const id = uuidv4();

  const pg = (await import('pg')).default;
  const client = new pg.Client({
    host,
    port: Number.parseInt(port, 10),
    database,
    user,
    password: password || undefined,
  });

  try {
    await client.connect();
  } catch (err) {
    console.error('Could not connect to management database:', err.message);
    process.exit(1);
  }

  try {
    const existing = await client.query(
      'SELECT id FROM management_user WHERE is_super_admin = true LIMIT 1'
    );
    if (existing.rows.length > 0) {
      console.log('Super admin already exists. No action taken.');
      return;
    }

    await client.query('BEGIN');
    try {
      await client.query(
        `INSERT INTO management_user (id, is_super_admin, created_by)
         VALUES ($1, true, NULL)`,
        [id]
      );
      await client.query(
        `INSERT INTO management_user_credentials (management_user_id, email, password_hash)
         VALUES ($1, $2, $3)`,
        [id, email, passwordHash]
      );
      await client.query(
        `INSERT INTO management_user_bio (management_user_id, display_name)
         VALUES ($1, 'Super Admin')`,
        [id]
      );
      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    }

    console.log('');
    console.log('Super admin created.');
    console.log('Email:', email);
    if (localPassword) {
      console.log('Password: Test!1Aa (local-only insecure; change in production.)');
    } else {
      console.log('Password (save this; it will not be shown again):');
      console.log('  ' + plainPassword);
    }
    console.log('');
    console.log('You can change this password later in the management app settings.');
    console.log('');
  } catch (err) {
    console.error('Failed to create super admin:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
