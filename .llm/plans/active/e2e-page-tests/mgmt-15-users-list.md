# E2E: Management-web – Users list

## Route

(main)/users.

## Layout conditions to test

- Initial load: wait for list or loading to settle before asserting rows.
- Page title (e.g. "Users"); table with columns (e.g. email, display name, created).
- "New user" or "Create user" CTA when permitted; search/filter if present.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with users read:** List loads; create link if has create permission.
- **Unauthenticated:** Redirect to login.
- **No permission:** 403 or empty/restricted view.
- **Event visibility:** List may be filtered by event_visibility (own vs all_admins vs all) per admin.

## Values / display conditions

- Rows match management API (main app users); email, display name, dates.
- Empty state when no users; create CTA when permitted.
- Search: results match filter; URL params reflect state.
- Pagination: page, limit, total correct.

## CRUD

- **Read:** List from management API (users from main DB).
- **Create:** New user link → (main)/users/new.

## Functionality / interactions

- Search: input filters list; no infinite request loop.
- Row click or link → user detail with correct id.
- Create user → new user form.
- Edit link per row → user edit.
- Refresh: URL params (search, page) preserved; list state same after reload.
- Super admin vs non–super admin: list scoped by event_visibility where applicable.

## Edge / error states

- API error: "Failed to load users" or equivalent; table not broken.
- Empty list: empty message.
- Permission denied: 403 or redirect.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Main DB has seeded users; assert list shows expected users and create works when permitted.
