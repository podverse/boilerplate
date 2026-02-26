/**
 * Shared max lengths for DB columns and validation.
 * Align with infra/database/migrations (e.g. varchar_email, varchar_password, varchar_short).
 * Use in ORM entities and app validation so values stay in sync.
 */
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_HASH_LENGTH = 60;
export const SHORT_TEXT_MAX_LENGTH = 50;
