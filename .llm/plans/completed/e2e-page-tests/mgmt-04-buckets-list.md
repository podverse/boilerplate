# E2E: Management-web – Buckets list – Detailed Plan

## Route and objective

- **Route:** `(main)/buckets`.
- **Objective:** Verify buckets table (name, owner, public, actions), create bucket CTA when permitted, search/filter and pagination, permission-based visibility (bucketsCrud read); unauthenticated redirect.

## Selector strategy

- Table: `getByRole('table')` with columns name, owner, public, actions.
- New bucket: `getByRole('link', { name: /new bucket|create bucket/i })`.
- Search/filter: `getByRole('searchbox')` or `getByLabel(/search|filter/i)`.
- Row links: bucket name or first cell → bucket detail.
- Empty state: "No buckets" or equivalent.

## Assertion matrix

### Layout

- Initial load: wait for list or loading to settle.
- Page title "Buckets"; table with columns (name, owner, public, actions).
- "New bucket" or "Create bucket" CTA when permitted; search/filter if present.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with buckets read | Load /buckets | List loads; create link if has create permission. |
| Unauthenticated | Load /buckets | Redirect to /login. |
| No permission | Load /buckets | 403 or empty/restricted view. |

### Values / display

- Rows match API (bucket name, owner, isPublic); pagination if present.
- Empty state when no buckets; create CTA when permitted.
- Search/filter: results match; URL params reflect state.
- Sortable headers and saved sort preference (when implemented) restore expected row order when the page is revisited without explicit sort params.
- Super admin vs non–super admin: list scoped by permissions.

### Interaction

- Search: input updates list; URL params updated; no infinite loop.
- Row click or link → bucket detail with correct id.
- Create bucket → /buckets/new.
- Edit/settings links → correct bucket routes.
- Sortable header change updates row order and URL sort params; revisiting without sort params restores the saved sort preference.
- Refresh: URL params preserved; list state same.
- Accessibility: primary actions (Create bucket, row links) focusable; tab order reasonable.

## CRUD

- **Read:** List from management API; scoped by permission.
- **Create:** New bucket link → /buckets/new.

## Edge / error states

- API error: "Failed to load buckets" or equivalent; table not broken.
- Empty list: empty message.
- Permission denied: 403 or redirect.

## Test data mapping

- **Seeded buckets:** From main DB; management API may proxy; assert list shows expected buckets.
- **Create:** When permitted, create one bucket and assert in list.
- **Permission:** Super admin sees list; non–super admin with bucketsCrud read sees list; no read → 403.

## Screenshot and trace checkpoints

- List loaded: "mgmt-buckets-list".
- Empty state: "mgmt-buckets-empty".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; buckets list spec.

## Implementation notes

- Spec: `apps/management-web/e2e/buckets.spec.ts`.
- Page: `apps/management-web/src/app/(main)/buckets/page.tsx`.
- Test: unauthenticated redirect; list with seed data; create link when permitted; optional search/pagination.
