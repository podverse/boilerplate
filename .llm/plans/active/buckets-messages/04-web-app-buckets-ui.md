# 04 – Web app: buckets UI

**Scope:** `apps/web` (main web app). Logged-in users manage their buckets and topics; style and patterns follow `apps/management-web`.

## Reuse from management-web

- `ResourcePageCard`, `ResourceTableWithFilter` (or a BucketsTableWithFilter that wraps it).
- `ConfirmDeleteModal`, `useDeleteModal`, `useTableFilterState`.
- Copy or share via package: decide whether to move shared components to `packages/ui` or duplicate in apps/web with same UX.

## Routes

- Main nav: add “Buckets” entry.
- `/buckets` – List.
- `/buckets/new` – Create bucket.
- `/buckets/[id]` – Bucket detail.
- `/buckets/[id]/edit` – Edit bucket.
- Bucket admins: page or section (e.g. `/buckets/[id]/admins`).
- Topics: create from bucket detail (e.g. `/buckets/[id]/topics/new`).

## Pages

### List

- Buckets the user can read (owner or bucket admin).
- Columns: name, slug, is_public, role (owner/admin).
- Actions: create bucket, edit, delete (by permission); link to bucket detail.

### Create/Edit bucket

- Form: name, slug (optional auto from name), is_public.
- For edit: show topics list and “Add topic”; link to bucket admins management.

### Bucket detail

- Show bucket info.
- List topics (with create/edit/delete by permission).
- List messages (link to message list or inline).
- “Bucket admins” section (add/remove/edit permissions).

### Bucket admins

- Page or section: list admins; add user (by email or id from main app user table); set `bucket_crud` and `message_crud` (checkboxes or bitmask UI).
- Edit/remove admins.

## Auth and API

- Reuse apps/web auth (e.g. AuthContext, protected layout). All bucket routes require login; 401 redirect to login.
- API client: call main API with cookie or Bearer; use request helpers; base URL from env/runtime config.

## Verification

- Manual run: create bucket, add topic, add bucket admin with limited CRUD; confirm list/detail/edit/delete respect permissions.
