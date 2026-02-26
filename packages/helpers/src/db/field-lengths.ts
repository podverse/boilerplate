/**
 * Shared max lengths for DB columns and validation.
 * Align with infra/database/migrations (e.g. varchar_email, varchar_password, varchar_short).
 * Use in ORM entities and app validation so values stay in sync.
 */
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_HASH_LENGTH = 60;
export const PASSWORD_MAX_LENGTH = 72;
export const SHORT_TEXT_MAX_LENGTH = 50;
/** SHA-256 hex digest length; used for verification_token.token_hash. */
export const TOKEN_HASH_HEX_LENGTH = 64;
/** Max length for verification_token.kind (e.g. email_verify, password_reset). */
export const VERIFICATION_TOKEN_KIND_MAX_LENGTH = 32;
