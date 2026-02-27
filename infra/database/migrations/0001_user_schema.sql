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
