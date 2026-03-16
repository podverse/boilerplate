# E2E: Management-web – Events – Detailed Plan

## Route and objective

- **Route:** `(main)/events`; query params: page, limit, sort (newest/oldest), search.
- **Objective:** Verify events table (actor, action, target, timestamp, details), sort, search, pagination, and event_visibility scoping (own, all_admins, all) for non–super admin; unauthenticated redirect.

## Selector strategy

- Table: `getByRole('table')` with columns actor, action, target, timestamp, details.
- Sort: `getByRole('combobox', { name: /sort/i })` or select (newest/oldest).
- Search: `getByRole('searchbox')` or `getByLabel(/search/i)`.
- Pagination: next/prev or page numbers; total/count.
- Empty state: "No events" or equivalent.

## Assertion matrix

### Layout

- Initial load: wait for table or loading to settle.
- Page title "Events"; table columns (actor, action, target, timestamp, details).
- Sort select; search input; pagination (page, total, limit).
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with event list permission | Load /events | Events load; rows per event_visibility. |
| Unauthenticated | Load /events | Redirect to /login. |
| No permission or event_visibility own with no events | Load | Empty list or restricted rows. |
| Super admin | Load | Typically all events (or per event_visibility). |

### Values / display

- Rows match management_event API; actor display name, action, target type/id, timestamp, details.
- Timestamps formatted (locale).
- Sort: newest first vs oldest first; order correct.
- Search: filters by actor, action, target, details; results match; URL params updated.
- Pagination: page, limit, total correct; next/prev work.
- Empty state when no events or no visible events.
- Saved sort preference and filter-column state (when implemented) are restored when the page is revisited without explicit params.

### Interaction

- Sort change: URL and list update.
- Search: input triggers fetch; URL params updated; no infinite loop.
- Filter-column selection (if present) updates `filterColumns` in the URL and limits matches to chosen fields.
- Pagination: click page or next/prev; list updates; URL reflects page.
- Refresh: URL params (page, sort, search) preserved.
- No edit/delete actions on events (read-only audit log).
- Accessibility: primary actions (sort, search, pagination) focusable; tab order reasonable.

## CRUD

- **Read only:** Events are audit log; list from management API; scoped by event_visibility and permissions.

## Edge / error states

- API error: "Failed to load events" or equivalent; table not broken.
- Empty list: empty message.
- Permission denied: 403 or empty/restricted list.
- Invalid page param: fallback to page 1 or 404 per app.

## Test data mapping

- **Seed:** management_event rows in seed (or create via API during test).
- **Super admin:** Sees all or scoped events per app.
- **Non–super admin:** event_visibility own / all_admins / all; assert row set differs.
- Assert sort, search, and pagination with seeded events.

## Screenshot and trace checkpoints

- Events list: "mgmt-events-list".
- Empty state: "mgmt-events-empty".
- After sort/search: "mgmt-events-sorted-or-searched".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; events spec.

## Implementation notes

- Spec: `apps/management-web/e2e/events.spec.ts`.
- Page: `apps/management-web/src/app/(main)/events/page.tsx`.
- Test: unauthenticated redirect; list with sort, search, pagination; mandatory event_visibility branches for scoped-admin roles.
