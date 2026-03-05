# 01 – Permissions model: bucketsCrud and messagesCrud

## Scope

Add `bucketsCrud` and `messagesCrud` to management admin permissions. Both default to **0** (all disabled) when an admin is created. No change to super-admin behavior (implicit full access).

## Steps

### 1. Database

- Add `buckets_crud` and `messages_crud` to the existing `admin_permissions` CREATE TABLE in `infra/management-database/migrations/0002_admin_permissions.sql` (and combined init):
  - `buckets_crud INTEGER NOT NULL DEFAULT 0 CHECK (buckets_crud >= 0 AND buckets_crud <= 15)`
  - `messages_crud INTEGER NOT NULL DEFAULT 0 CHECK (messages_crud >= 0 AND messages_crud <= 15)`

### 2. Management ORM

- **Entity** `packages/management-orm/src/entities/AdminPermissions.ts`:
  - Add `bucketsCrud!: number` and `messagesCrud!: number` with `@Column(..., default: 0)`.
- **ManagementUserService** (create/update):
  - Include `bucketsCrud` and `messagesCrud` in create payload and update allowed keys; default to 0 when creating.

### 3. Management API

- **Schemas** `apps/management-api/src/schemas/admins.ts`:
  - In `createAdminSchema`: `bucketsCrud: crudSchema.default(0)`, `messagesCrud: crudSchema.default(0)`.
  - In `updateAdminSchema`: add optional `bucketsCrud`, `messagesCrud`.
- **Controllers** `apps/management-api/src/controllers/adminsController.ts`:
  - Create: pass `bucketsCrud`, `messagesCrud` (from body or default 0).
  - Update: allow `body.bucketsCrud` and `body.messagesCrud`; add to `permissionKeys` (or equivalent) so only super-admin can change.
- **OpenAPI** `apps/management-api/src/openapi.ts`:
  - Add `bucketsCrud` and `messagesCrud` to AdminPermissions schema (integer 0–15, default 0) and to create/update admin request bodies.

### 4. Management-web types and UI

- **Types** `apps/management-web/src/types/management-api.ts`:
  - In `ManagementUserPermissions`, add `bucketsCrud: number` and `messagesCrud: number`.
- **Admin create/edit** (e.g. create admin form, edit admin form):
  - Add Bucket permissions and Message permissions CRUD checkboxes (same pattern as admins/users); default all unchecked (0).
  - Use same bitmask convention: create=1, read=2, update=4, delete=8.

### 5. Main nav and helpers

- **main-nav** `apps/management-web/src/lib/main-nav.ts`:
  - Extend `CrudPermissionKey` to include `'bucketsCrud' | 'messagesCrud'`.
  - Add Buckets nav entry with `readPermission: 'bucketsCrud'` (so tab only visible when read is set). Do not add a separate “Messages” top-level tab; messages are reached via bucket detail.

## Key files

- `infra/management-database/migrations/` (new migration)
- `packages/management-orm/src/entities/AdminPermissions.ts`
- `packages/management-orm/src/services/ManagementUserService.ts`
- `apps/management-api/src/schemas/admins.ts`
- `apps/management-api/src/controllers/adminsController.ts`
- `apps/management-api/src/openapi.ts`
- `apps/management-web/src/types/management-api.ts`
- `apps/management-web/src/lib/main-nav.ts`
- Admin create/edit form components (e.g. under `apps/management-web/src/app/(main)/admins/`)

## Verification

- New admin has `bucketsCrud: 0`, `messagesCrud: 0` in DB and in GET /auth/me (or equivalent).
- Super-admin can set bucketsCrud/messagesCrud when creating/updating admin.
- Management-web: Buckets tab only visible when bucketsCrud read is set; admin create/edit show bucket and message permission checkboxes defaulting to unchecked.
