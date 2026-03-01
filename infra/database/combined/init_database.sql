-- Combined migrations generated Sun Mar  1 00:25:56 CST 2026
-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh

-- Including: 0000_init_helpers.sql
-- 0000 migration

-- Minimal helper domains (only what user and related tables need).
-- Lengths (255, 60, 50, 32, 64) align with @boilerplate/helpers field-lengths.

CREATE DOMAIN varchar_email AS VARCHAR(255) CHECK (VALUE ~ '^.+@.+\..+$');
CREATE DOMAIN varchar_password AS VARCHAR(60);
CREATE DOMAIN varchar_short AS VARCHAR(50);
-- Verification tokens: kind (e.g. email_verify) and SHA-256 hex hash; lengths align with @boilerplate/helpers
CREATE DOMAIN varchar_token_kind AS VARCHAR(32);
CREATE DOMAIN varchar_token_hash AS VARCHAR(64);
CREATE DOMAIN server_time_with_default AS TIMESTAMP DEFAULT NOW();

-- Function to set updated_at (used by user and future tables)

CREATE OR REPLACE FUNCTION set_updated_at_field()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Including: 0001_user_schema.sql
-- 0001 migration: user (singular) with join tables user_credentials, user_bio; verification_token

-- Core user row (one per account)
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_visibility BOOLEAN NOT NULL DEFAULT false,
    email_verified_at TIMESTAMP NULL,
    created_at server_time_with_default NOT NULL,
    updated_at server_time_with_default NOT NULL
);

CREATE TRIGGER set_updated_at_user
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_field();

-- Credentials: email and password hash (1:1 with user)
CREATE TABLE user_credentials (
    user_id UUID PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    email varchar_email UNIQUE NOT NULL,
    password_hash varchar_password NOT NULL
);

-- Bio: display name (1:1 with user)
CREATE TABLE user_bio (
    user_id UUID PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
    display_name varchar_short NULL
);

-- One-time verification tokens (email verify, password reset, email change)
CREATE TABLE verification_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    kind varchar_token_kind NOT NULL,
    token_hash varchar_token_hash NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    payload JSONB NULL
);

CREATE UNIQUE INDEX idx_verification_token_hash ON verification_token(token_hash);
CREATE INDEX idx_verification_token_expires_at ON verification_token(expires_at);


-- Including: 0002_refresh_token.sql
-- 0002 migration: refresh_token for HTTP-only refresh cookie rotation/revocation

CREATE TABLE refresh_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token_hash varchar_token_hash NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX idx_refresh_token_hash ON refresh_token(token_hash);
CREATE INDEX idx_refresh_token_expires_at ON refresh_token(expires_at);
CREATE INDEX idx_refresh_token_user_id ON refresh_token(user_id);


-- Including: 0003_user_credentials_integrity.sql
-- 0003: Enforce that every user has exactly one user_credentials row (created in the same
-- transaction). Display name (user_bio) is optional in main. Prevent direct DELETE on user_credentials.

-- Prevent direct DELETE on user_credentials; must delete "user" (CASCADE).
CREATE OR REPLACE FUNCTION reject_direct_delete_user_credentials()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Cannot delete user_credentials directly; delete the user to remove the account (CASCADE will remove credentials and bio).'
    USING ERRCODE = 'restrict_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_direct_delete_user_credentials
  BEFORE DELETE ON user_credentials
  FOR EACH ROW EXECUTE PROCEDURE reject_direct_delete_user_credentials();

-- Every user must have exactly one user_credentials row. Check is deferred to commit so user + credentials
-- (and optionally user_bio) can be inserted in one transaction.
CREATE OR REPLACE FUNCTION check_user_has_credentials()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_credentials c WHERE c.user_id = NEW.id) THEN
    RAISE EXCEPTION 'Every user must have exactly one user_credentials row; create user and credentials in the same transaction.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ensure_user_has_credentials
  AFTER INSERT OR UPDATE ON "user"
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_has_credentials();


