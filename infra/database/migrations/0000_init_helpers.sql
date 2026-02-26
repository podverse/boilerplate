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
