# 01 – Data model and migrations

**Scope:** Main app database (not management). New entities and migrations only.

## Entities

### Bucket

- `id` (PK, uuid)
- `owner_id` (FK to user)
- `name` (varchar)
- `slug` (unique, for URLs and public POST path)
- `is_public` (boolean)
- `parent_bucket_id` (nullable FK to bucket; null = top-level Bucket)
- `created_at`, `updated_at`

Index on `owner_id`, unique on `slug`, index on `parent_bucket_id`. Top-level buckets have `parent_bucket_id = null`; **Topics** are buckets with `parent_bucket_id` set (one level of nesting only).

### BucketAdmin

- `id` (PK, uuid)
- `bucket_id` (FK to bucket, CASCADE)
- `user_id` (FK to user, CASCADE)
- `bucket_crud` (int, CRUD bitmask for bucket)
- `message_crud` (int, CRUD bitmask for messages in that bucket)
- `created_at`

Unique on `(bucket_id, user_id)`.

### BucketMessage

- `id` (PK, uuid)
- `bucket_id` (FK to bucket)
- `sender_name` (varchar, from submitter)
- `body` (text)
- `is_public` (boolean; if false only owner/admins see it)
- `created_at`

Index on `bucket_id`, `created_at`; index on `(bucket_id, is_public)` for public-page queries.

## Migrations

- Add numbered SQL under `infra/database/migrations/`.
- Regenerate `infra/database/combined/init_database.sql` via `scripts/database/combine-migrations.sh`.
- Use existing domains/varchar conventions from the combined init file.

## ORM

- New entities in `packages/orm/src/entities/`.
- Register in `packages/orm/src/data-source.ts`.
- Services: `BucketService`, `BucketAdminService`, `BucketMessageService` in `packages/orm/src/services/` (read vs read-write as per existing pattern).
- Types in helpers or orm as needed (e.g. slug generation, CRUD bitmask reuse from `packages/helpers/src/crud/crud-bitmask.ts`).

## Verification

- Migrations apply cleanly.
- ORM builds.
- Unit or integration test that creates bucket, topic (child bucket), message, bucket admin.
