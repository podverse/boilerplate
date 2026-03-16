# 04 – Management-web: Buckets list page

## Scope

Management-web has a **Buckets** list page that follows the **users page** pattern: filter table (FilterTablePageLayout or equivalent), add bucket button (if create permission), and per-row view/edit/delete actions gated by bucketsCrud. The Buckets nav entry is visible only when the admin has **bucketsCrud read**.

## Steps

### 1. Nav and route

- Add **Buckets** to main nav (see 01-permissions-model.md): `href: ROUTES.BUCKETS`, `labelKey: 'buckets'` (or equivalent), `readPermission: 'bucketsCrud'`. So the tab shows only when user has read.
- Define `ROUTES.BUCKETS` (e.g. `/buckets`) and optionally `ROUTES.BUCKETS_NEW`, `ROUTES.BUCKETS_EDIT`, etc., in management-web routes.
- Layout: ensure (main) layout renders nav and content; buckets list is under e.g. `(main)/buckets/page.tsx`.

### 2. Buckets list page structure

- Mirror **users** page:
  - Server component: resolve search and filter params (e.g. search, filterColumns); check permission (redirect to dashboard or 403 if no bucketsCrud read); fetch buckets from management API (GET /buckets or equivalent).
  - Use **FilterTablePageLayout** (or same layout as users) with title, error state, and a table component.
  - Table: **ResourceTableWithFilter** (or same pattern as users) with columns e.g. name, isPublic (or slug), actions. Rows = buckets; `viewRoute`, `editRoute`, `onDelete`, `addHref` all gated by getCrudFlags(..., 'bucketsCrud').
  - Filter: backend-only (search param to API); filterable columns if needed (e.g. name only, per product decision).
  - Add bucket button: visible only when `crud.create`; links to new bucket page.

### 3. CRUD flags and actions

- Use `getCrudFlags(isSuperAdmin, permissions, 'bucketsCrud')` to get create/read/update/delete booleans.
- Read: required to see the page and the table.
- Create: show “Add bucket” and allow navigation to new bucket page.
- Update: show Edit in row actions and allow navigation to edit page.
- Delete: show Delete in row actions and call delete endpoint with confirmation.
- View: show View in row actions; links to bucket detail page (same experience as owner, using shared UI from 03).

### 4. Data fetching and API

- Page calls management API (e.g. GET /buckets?search=...) with management auth (cookie or server-side request with session). Map response to table rows (id, name, isPublic, etc.).
- Handle errors (403, 500) and show error message in layout; empty state when no buckets.

### 5. i18n and accessibility

- Add translation keys for “Buckets”, “Add bucket”, column headers, empty state, delete confirm, etc. (reuse or align with users page keys).
- Ensure table and buttons have correct labels and roles for a11y.

## Key files

- `apps/management-web/src/lib/routes.ts` (BUCKETS, BUCKETS_NEW, bucket detail/edit routes)
- `apps/management-web/src/lib/main-nav.ts` (Buckets entry with readPermission: 'bucketsCrud')
- `apps/management-web/src/app/(main)/buckets/page.tsx` (list page)
- `apps/management-web/src/components/BucketsTableWithFilter.tsx` (or equivalent; can mirror UsersTableWithFilter pattern)
- Management API client or server fetch for GET /buckets
- i18n files for common/buckets keys

## Verification

- With bucketsCrud read = 0, Buckets tab is hidden and direct navigation to /buckets redirects or 403.
- With read only: list visible, no Add bucket, no Edit/Delete (or they disabled/hidden).
- With create: Add bucket visible and new bucket page reachable.
- With update/delete: Edit and Delete actions work per row. List and filter work; backend search is used.
