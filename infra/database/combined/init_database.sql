-- Combined migrations generated Thu Feb 26 12:29:56 CST 2026
-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh

-- Including: 0000_init_helpers.sql
-- 0000 migration

-- Extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Minimal helper domains (only what users table and small future schema need)

CREATE DOMAIN varchar_email AS VARCHAR(255) CHECK (VALUE ~ '^.+@.+\..+$');
-- bcrypt salted hash passwords are always 60 characters long
CREATE DOMAIN varchar_password AS VARCHAR(60);
CREATE DOMAIN varchar_short AS VARCHAR(50);
CREATE DOMAIN server_time_with_default AS TIMESTAMP DEFAULT NOW();

-- Function to set updated_at (used by users and future tables)

CREATE OR REPLACE FUNCTION set_updated_at_field()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Including: 0001_users.sql
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


