# E2E: Management-web – Buckets list

## Route

(main)/buckets.

## Layout conditions to test

- Initial load: wait for list or loading to settle before asserting rows.
- Page title (e.g. "Buckets"); table with columns (e.g. name, owner, public, actions).
- "New bucket" or "Create bucket" CTA; filter/search if present.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with buckets read:** List loads; create link if has create permission.
- **Unauthenticated:** Redirect to login.
- **No permission:** 403 or empty/restricted view per app.

## Values / display conditions

- Rows match API (bucket name, owner, isPublic); pagination if present.
- Empty state when no buckets; create CTA still available when permitted.
- Search/filter: results match filter; URL params reflect state.

## CRUD

- **Read:** List from management API; scoped by permission.
- **Create:** New bucket link → (main)/buckets/new.

## Functionality / interactions

- Search: input updates list; URL params updated; no infinite request loop.
- Row click or link → bucket detail with correct id.
- Create bucket → new bucket form.
- Edit/settings links per row → correct bucket routes.
- Refresh: URL params (search, page) preserved; list state same after reload.
- Super admin vs non–super admin: list scoped by permissions where applicable.

## Edge / error states

- API error: error message (e.g. "Failed to load buckets"); table not broken.
- Empty list: empty message.
- Permission denied: clear message or redirect.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Main DB has seeded buckets; management API may proxy main API; assert list shows expected buckets and create works.
