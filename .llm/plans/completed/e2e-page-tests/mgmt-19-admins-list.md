# E2E: Management-web – Admins list – Detailed Plan

## Route and objective

- **Route:** `(main)/admins`.
- **Objective:** Verify admins table (username/email, display name, super admin flag, permissions summary), create admin CTA when permitted (adminsCrud create), search/filter and pagination, event_visibility scoping; unauthenticated redirect.

## Selector strategy

- Table: `getByRole('table')` with columns (username/email, display name, super admin, permissions, actions).
- New admin: `getByRole('link', { name: /new admin|create admin/i })`.
- Search/filter: `getByRole('searchbox')` or `getByLabel(/search|filter/i)`.
- Row links: admin username or name → admin detail.
- Empty state: "No admins" (except super admin always present).
- Pagination if present.

## Assertion matrix

### Layout

- Initial load: wait for list or loading to settle.
- Page title "Admins"; table with columns (username, display name, super admin, permissions summary).
- "New admin" or "Create admin" CTA when permitted; search/filter if present.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with admins read | Load /admins | List loads; create link if has admins create. |
| Unauthenticated | Load /admins | Redirect to /login. |
| No permission | Load /admins | 403 or redirect. |
| Event visibility | List scope | Super admin sees all; non–super admin may see restricted set (own or all_admins). |

### Values / display

- Rows match management API (management_user, credentials, bio, permissions).
- Super admin indicated (e.g. badge or column); other admins show permission summary or roles.
- Empty state when no admins except super admin; create CTA when permitted.
- Search/filter: results match; URL params updated.
- Sortable headers and saved sort preference (when implemented) restore expected row order when the page is revisited without explicit sort params.

### Interaction

- Search: filters list; no infinite loop.
- Filter-column selection (if present) updates `filterColumns` in the URL and limits matches to the chosen fields.
- Row click or link → admin detail with correct id.
- Create admin → /admins/new.
- Edit link → /admin/[id]/edit.
- Sortable header change updates row order and URL sort params; revisiting without sort params restores the saved sort preference.
- Refresh: URL params preserved; list state same.
- Super admin sees all admins; non–super admin may see restricted set.
- Super-admin rows never expose delete, and any self-delete or self-deactivation branch follows the app's logout/redirect behavior rather than leaving a stale session.
- Accessibility: primary actions (Create admin, row links) focusable; tab order reasonable.

## CRUD

- **Read:** List from management API.
- **Create:** New admin link → /admins/new.

## Edge / error states

- API error: message; table not broken.
- Empty list (except super admin): empty message.
- Permission denied: 403.

## Test data mapping

- **Seeded super admin:** e2e-superadmin@example.com in list; assert username, display name, super admin flag.
- **Create:** When permitted, create one admin and assert in list.
- **Event visibility:** Non–super admin with event_visibility own may see only self in list; all_admins or all per app.

## Screenshot and trace checkpoints

- List: "mgmt-admins-list".
- Empty (if applicable): "mgmt-admins-empty".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; admins list spec.

## Implementation notes

- Spec: `apps/management-web/e2e/admins.spec.ts`.
- Page: `apps/management-web/src/app/(main)/admins/page.tsx`.
- Management uses username for login; list may show username or email per app.
- Test: auth redirect; list with super admin; create link when permitted; search; mandatory event_visibility coverage for scoped-admin branches.
