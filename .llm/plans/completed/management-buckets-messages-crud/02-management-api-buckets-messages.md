# 02 – Management API: bucket and message endpoints

## Scope

Management API must expose bucket and message operations so management-web can list, create, get, update, and delete buckets and messages. All endpoints must enforce **bucketsCrud** and **messagesCrud** (and message read must restrict non-public messages when read bit is 0). Design choice: management-api either uses the **main app database** (shared or separate connection to bucket/message tables) or **calls the main API** with a service/impersonation token; this plan assumes the repo has or will add a way for management-api to access bucket and message data (e.g. shared orm, or internal main-API routes).

## Steps

### 1. Data access

- Decide and implement how management-api reads/writes buckets and messages:
  - **Option A:** Management-api uses `@boilerplate/orm` (or a read-only clone) and the main app DB for bucket/message tables; ensure connection/config and that management user identity is passed for permission checks.
  - **Option B:** Main API exposes internal or admin endpoints (e.g. list buckets, list messages for bucket) that accept a management-auth header or token; management-api calls these and forwards or transforms responses.
- Document the choice in code or docs.

### 2. Bucket endpoints (management API)

- **List buckets** (e.g. GET /buckets): Returns buckets the authenticated management user is allowed to see. Filter by bucketsCrud read: only return if actor has read. If data is from main app, define “which buckets” (e.g. all buckets in main DB; or only buckets linked to management in some way). Pagination/search as needed (align with users list pattern).
- **Get bucket** (e.g. GET /buckets/:id): Return one bucket; 403 if bucketsCrud read is 0.
- **Create bucket** (e.g. POST /buckets): 403 if bucketsCrud create is 0; body and behavior align with main API bucket create (name, isPublic, etc.).
- **Update bucket** (e.g. PATCH /buckets/:id): 403 if bucketsCrud update is 0.
- **Delete bucket** (e.g. DELETE /buckets/:id): 403 if bucketsCrud delete is 0.
- All bucket routes: require management auth; resolve management user and load permissions; check corresponding bucketsCrud bit before performing action.

### 3. Message endpoints (management API)

- **List messages for a bucket** (e.g. GET /buckets/:id/messages): Require bucketsCrud read and messagesCrud read. If messagesCrud read is 0, return 403. If read is 1, return only **public** messages (or 403 for the whole list if policy is “no access without read”). So: with read, return messages (filtering non-public for non-read is redundant if we 403 without read).
- **Get message** (e.g. GET /buckets/:bucketId/messages/:messageId): 403 if messagesCrud read is 0; if read is 1, allow only for public messages or enforce same policy as main app (e.g. only public unless user has message read).
- **Create/update/delete message**: Enforce create/update/delete bits of messagesCrud; 403 otherwise.
- Ensure non-public messages are not returned when the management admin does not have messagesCrud read.

### 4. OpenAPI and tests

- Document all new endpoints and request/response bodies in OpenAPI.
- Add or extend tests: list/get bucket and list/get message with and without permissions; 403 when bits are 0.

## Key files

- `apps/management-api/src/controllers/` (new or existing bucketsController, messagesController for management)
- `apps/management-api/src/routes/` (register bucket and message routes)
- `apps/management-api/src/openapi.ts`
- Main app orm/API if Option B (internal endpoints)
- Permission helper: given management user, return bucketsCrud/messagesCrud and check bits before each operation

## Verification

- With bucketsCrud read = 0, GET /buckets and GET /buckets/:id return 403.
- With messagesCrud read = 0, GET /buckets/:id/messages returns 403; with read = 1, list returns messages (only public if that’s the policy).
- Create/update/delete bucket and message return 403 when the corresponding CRUD bit is 0.
