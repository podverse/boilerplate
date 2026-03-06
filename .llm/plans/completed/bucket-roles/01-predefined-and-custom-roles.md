# Predefined and custom roles – data model and backend

## 1.1 Predefined roles (code only)

Define in a shared place (e.g. `packages/helpers` or `packages/management-orm`):

- **Full** — `bucket_crud: 15`, `message_crud: 15`, `admin_crud: 15`.
- **No update** — create+read+delete = 11 for bucket and message; admin e.g. 11 (API forces read).
- **No delete** — create+read+update = 7 for all three.
- **Read only** — 2 for all three.

Use a single source of truth: e.g. `PREDEFINED_BUCKET_ROLES` array with `id`, `nameKey`,
`bucketCrud`, `messageCrud`, `adminCrud`. i18n keys: `roles.full`, `roles.noUpdate`,
`roles.noDelete`, `roles.readOnly`.

Optional later: Contributor (create+read), Moderator (read+update+delete). See 00-SUMMARY
recommendation table.

## 1.2 Custom roles – schema

Main app DB (same as `bucket_admin`). Add table `bucket_role` in
`infra/database/combined/init_database.sql` (and migration if incremental):

- `id` UUID PK default gen_random_uuid()
- `bucket_id` UUID NOT NULL REFERENCES bucket(id) ON DELETE CASCADE
- `name` short text NOT NULL (e.g. varchar_short)
- `bucket_crud` INTEGER NOT NULL (0–15)
- `message_crud` INTEGER NOT NULL (0–15)
- `admin_crud` INTEGER NOT NULL (0–15)
- `created_at` server_time_with_default NOT NULL
- UNIQUE (bucket_id, name)

Index on `bucket_id`.

## 1.3 ORM

- **Entity** `BucketRole` in `packages/orm/src/entities/`, mirroring `BucketAdmin` pattern.
  Use snake_case column names (`bucket_id`, `bucket_crud`, etc.) per database-schema-naming skill.
- **Service** `BucketRoleService`: `findByBucketId(bucketId)`, `create(data)`, `update(id, data)`,
  `delete(id)`. Register in ORM index and data-source.

## 1.4 Management API

In `apps/management-api/src/routes/buckets.ts` (and new controller + schemas):

- **GET /buckets/:id/roles** — Resolve bucket by id/shortId (reuse `getBucketAndEffective`).
  Return predefined roles + custom roles for that bucket. Require buckets read + bucketAdmins
  read (or a dedicated roles read if split).
- **POST /buckets/:id/roles** — Body: name, bucket_crud, message_crud, admin_crud. Create custom
  role. Require buckets read + bucketAdmins create.
- **PATCH /buckets/:id/roles/:roleId** — Update custom role (roleId = UUID). Require buckets
  read + bucketAdmins update.
- **DELETE /buckets/:id/roles/:roleId** — Delete custom role. Require buckets read +
  bucketAdmins delete.

Schemas: Joi for create/update (name, crud 0–15). Reuse `crudMask` from `apps/management-api/src/schemas/buckets.ts`.

OpenAPI: Update `apps/management-api/src/openapi.ts` with new endpoints and types.
