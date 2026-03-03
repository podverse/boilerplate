# 03 – API endpoints

**Scope:** `apps/api` only. New routes under versioned path (e.g. `/v1/buckets`). No auth for public submit and public read; auth required for all other bucket/message operations.

## Authenticated (require JWT/session)

### Buckets

- `GET /v1/buckets` – List buckets where user is owner or bucket admin; filter by permission.
- `POST /v1/buckets` – Create; user = owner.
- `GET /v1/buckets/:id` – Get one; enforce read permission.
- `PATCH /v1/buckets/:id` – Update; enforce update permission.
- `DELETE /v1/buckets/:id` – Delete; enforce delete permission.

### Topics (child buckets)

- `GET /v1/buckets/:bucketId/buckets` – List children; require read on parent.
- `POST /v1/buckets/:bucketId/buckets` – Create topic; require create on parent; `owner_id` can be current user or inherit from parent (decide in 01).

### Bucket admins

- `GET /v1/buckets/:bucketId/admins` – List; owner or admin with read/update on bucket.
- `POST /v1/buckets/:bucketId/admins` – Add; owner or admin with update on bucket.
- `PATCH /v1/buckets/:bucketId/admins/:userId` – Update permissions.
- `DELETE /v1/buckets/:bucketId/admins/:userId` – Remove admin.

### Messages (authenticated)

- `GET /v1/buckets/:bucketId/messages` – Paginated; filter by isPublic if not owner/admin.
- `GET /v1/buckets/:bucketId/messages/:id` – Get one; enforce read.
- `PATCH /v1/buckets/:bucketId/messages/:id` – Update; enforce update.
- `DELETE /v1/buckets/:bucketId/messages/:id` – Delete; enforce delete.

## Public (no auth)

### Submit message

- `POST /v1/buckets/by-slug/:slug/messages` (or `POST /v1/public/buckets/:slug/messages`).
- Body: `senderName`, `body`, `isPublic` (boolean).
- Validate slug exists and bucket allows public submit (bucket exists and optionally is_public; decide in 02).
- Rate-limit by IP or slug.

### Public read

- `GET /v1/buckets/by-slug/:slug` – Metadata only, if bucket is_public.
- `GET /v1/buckets/by-slug/:slug/messages` – Only messages where `is_public = true`; paginated.
- Return 404 if bucket not found or not public.

## Slug

- Unique per bucket (and thus per topic).
- Used in public URLs and in submit path.
- Generated from name (or provided) at create; editable on update with uniqueness check.

## Validation and docs

- Use existing validation patterns (e.g. Joi or current schema); request/response types in helpers or api.
- Update OpenAPI spec and ensure docs stay in sync.

## Verification

- Integration tests for all above.
- 401/403/404 where expected.
- Public submit and public read work without cookies.
