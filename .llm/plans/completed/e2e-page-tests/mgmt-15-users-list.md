# E2E: Management-web – Users list – Detailed Plan

## Route and objective

- **Route:** `(main)/users`.
- **Objective:** Verify users table (email, display name, created, etc.), create user CTA when permitted (usersCrud create), search/filter and pagination, event_visibility scoping (own vs all_admins vs all); unauthenticated redirect.

## Selector strategy

- Table: `getByRole('table')` with columns (email, display name, created, actions).
- New user: `getByRole('link', { name: /new user|create user/i })`.
- Search/filter: `getByRole('searchbox')` or `getByLabel(/search|filter/i)`.
- Row links: user email or name → user detail.
- Empty state: "No users" or equivalent.
- Pagination: next/prev or page numbers.

## Assertion matrix

### Layout

- Initial load: wait for list or loading to settle.
- Page title "Users"; table with columns (email, display name, created, etc.).
- "New user" or "Create user" CTA when permitted; search/filter if present.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with users read | Load /users | List loads; create link if has create permission. |
| Unauthenticated | Load /users | Redirect to /login. |
| No permission | Load /users | 403 or empty/restricted view. |
| Event visibility | List scope | own / all_admins / all per admin; super admin typically sees all. |

### Values / display

- Rows match management API (main app users); email, display name, dates.
- Empty state when no users; create CTA when permitted.
- Search: results match filter; URL params reflect state.
- Pagination: page, limit, total correct.
- Sortable headers and saved sort preference (when implemented) restore expected row order when the page is revisited without explicit sort params.

### Interaction

- Search: input filters list; no infinite request loop.
- Filter-column selection (if present) updates `filterColumns` in the URL and limits matches to the chosen fields.
- Row click or link → user detail with correct id.
- Create user → /users/new.
- Edit link per row → /user/[id]/edit.
- Sortable header change updates row order and URL sort params; revisiting without sort params restores the saved sort preference.
- Refresh: URL params (search, page) preserved; list state same.
- Super admin vs non–super admin: list scoped by event_visibility where applicable.
- Accessibility: primary actions (Create user, row links) focusable; tab order reasonable.

## CRUD

- **Read:** List from management API (main DB users).
- **Create:** New user link → /users/new.

## Edge / error states

- API error: "Failed to load users" or equivalent; table not broken.
- Empty list: empty message.
- Permission denied: 403 or redirect.

## Test data mapping

- **Seeded users:** Main DB has seeded users; assert list shows expected users (e.g. e2e@example.com).
- **Create:** When permitted, create one user and assert in list.
- **Event visibility:** Non–super admin with event_visibility own sees only own; all_admins or all per seed.

## Screenshot and trace checkpoints

- List: "mgmt-users-list".
- Empty state: "mgmt-users-empty".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; users list spec.

## Implementation notes

- Spec: `apps/management-web/e2e/users.spec.ts`.
- Page: `apps/management-web/src/app/(main)/users/page.tsx`.
- Test: auth redirect; list with seed data; create link when permitted; search/pagination; mandatory event_visibility coverage for scoped-admin branches.
