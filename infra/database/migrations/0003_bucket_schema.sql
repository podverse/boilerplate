-- 0003 migration: bucket (and topics as child buckets), bucket_admin, bucket_message

-- Bucket: top-level have parent_bucket_id NULL; topics are rows with parent_bucket_id set.
-- short_id: URL-safe public id (app sets on insert via nanoid).
CREATE TABLE bucket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    name varchar_short NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    parent_bucket_id UUID NULL REFERENCES bucket(id) ON DELETE CASCADE,
    short_id VARCHAR(12) NOT NULL,
    created_at server_time_with_default NOT NULL,
    updated_at server_time_with_default NOT NULL
);

CREATE TRIGGER set_updated_at_bucket
    BEFORE UPDATE ON bucket
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_field();

CREATE INDEX idx_bucket_owner_id ON bucket(owner_id);
CREATE INDEX idx_bucket_parent_bucket_id ON bucket(parent_bucket_id);
CREATE UNIQUE INDEX idx_bucket_short_id ON bucket(short_id);

-- Bucket admins: CRUD bitmasks for bucket and messages (create=1, read=2, update=4, delete=8).
CREATE TABLE bucket_admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL REFERENCES bucket(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    bucket_crud INTEGER NOT NULL DEFAULT 0,
    message_crud INTEGER NOT NULL DEFAULT 0,
    created_at server_time_with_default NOT NULL,
    UNIQUE (bucket_id, user_id)
);

CREATE INDEX idx_bucket_admin_bucket_id ON bucket_admin(bucket_id);
CREATE INDEX idx_bucket_admin_user_id ON bucket_admin(user_id);

-- Messages in a bucket; is_public controls visibility on public bucket page.
CREATE TABLE bucket_message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL REFERENCES bucket(id) ON DELETE CASCADE,
    sender_name varchar_short NOT NULL,
    body TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at server_time_with_default NOT NULL
);

CREATE INDEX idx_bucket_message_bucket_id ON bucket_message(bucket_id);
CREATE INDEX idx_bucket_message_created_at ON bucket_message(created_at);
CREATE INDEX idx_bucket_message_bucket_id_is_public ON bucket_message(bucket_id, is_public);
