-- 0001 migration

-- Users table (auth, plan 15)

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar_email UNIQUE NOT NULL,
    password varchar_password NOT NULL,
    display_name varchar_short,
    profile_visibility BOOLEAN NOT NULL DEFAULT false,
    created_at server_time_with_default NOT NULL,
    updated_at server_time_with_default NOT NULL
);

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_field();
