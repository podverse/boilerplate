import { randomBytes } from 'crypto';
import path from 'path';
/**
 * Interactive script to create the super admin user in the management database.
 * Used during infra up (make local_infra_up). Prompts for username, generates a secure
 * password, creates the user, and prints the password once with instructions.
 *
 * Run from repo root: node scripts/management-api/create-super-admin.mjs
 *
 * Loads .env from apps/management-api (MANAGEMENT_DB_*). If stdin is not a TTY,
 * uses default username "superadmin" and still creates user if none exists.
 *
 * Local-only: when LOCAL_SUPERADMIN_PASSWORD is set (e.g. by Make), creates
 * username "superadmin" with that password (insecure; local dev only).
 */
import { createInterface } from 'readline';
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

const DEFAULT_USERNAME = 'superadmin';

function isValidUsername(username) {
  return typeof username === 'string' && username.trim().length > 0 && username.length <= 50;
}

async function promptUsername() {
  const isTty = process.stdin.isTTY === true;

  const blurb = [
    '',
    'The super admin is the initial management user with full access (admins, users, settings).',
    'You will be prompted for a username; a strong password will be generated and shown once.',
    '',
  ].join('\n');

  if (isTty) {
    process.stdout.write(blurb);
    const raw = await readLine(`Username for super admin (blank = ${DEFAULT_USERNAME}): `);
    const username = (raw === '' ? DEFAULT_USERNAME : raw).trim();
    if (!isValidUsername(username)) {
      console.error(
        'Invalid username. Use a non-empty string (max 50 chars) or leave blank for superadmin.'
      );
      process.exit(1);
    }
    return username;
  }

  return DEFAULT_USERNAME;
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
      'Missing MANAGEMENT_DB_HOST, MANAGEMENT_DB_NAME, or MANAGEMENT_DB_USERNAME. Set apps/management-api/.env (e.g. from .env.example or make local_env_setup or make env_setup).'
    );
    process.exit(1);
  }

  const localPassword = process.env.LOCAL_SUPERADMIN_PASSWORD;
  const username =
    typeof localPassword === 'string' && localPassword.length > 0
      ? DEFAULT_USERNAME
      : await promptUsername();
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
        `INSERT INTO management_user_credentials (management_user_id, username, password_hash)
         VALUES ($1, $2, $3)`,
        [id, username, passwordHash]
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
    console.log('Username:', username);
    if (localPassword) {
      console.log('Password: Test!1Aa (local-only insecure; change in production.)');
    } else {
      console.log('Password (save this; it will not be shown again):');
      console.log('  ' + plainPassword);
    }
    console.log('');
    console.log('Management-web login: use the username above and the password.');
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
