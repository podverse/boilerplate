import crypto from 'crypto';

const TOKEN_BYTES = 32;
const HASH_ALGO = 'sha256';
const SET_PASSWORD_EXPIRY_DAYS = 7;

export function generateToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash(HASH_ALGO).update(token, 'utf8').digest('hex');
}

/** Expiry for set_password tokens (e.g. 7 days). Used when creating username-only users. */
export function getSetPasswordExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + SET_PASSWORD_EXPIRY_DAYS);
  return d;
}
