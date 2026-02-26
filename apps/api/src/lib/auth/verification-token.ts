import crypto from 'crypto';

const TOKEN_BYTES = 32;
const HASH_ALGO = 'sha256';

const EMAIL_VERIFY_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;
const EMAIL_CHANGE_EXPIRY_HOURS = 24;

export function generateToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash(HASH_ALGO).update(token, 'utf8').digest('hex');
}

export function getEmailVerifyExpiry(): Date {
  const d = new Date();
  d.setHours(d.getHours() + EMAIL_VERIFY_EXPIRY_HOURS);
  return d;
}

export function getPasswordResetExpiry(): Date {
  const d = new Date();
  d.setHours(d.getHours() + PASSWORD_RESET_EXPIRY_HOURS);
  return d;
}

export function getEmailChangeExpiry(): Date {
  const d = new Date();
  d.setHours(d.getHours() + EMAIL_CHANGE_EXPIRY_HOURS);
  return d;
}
