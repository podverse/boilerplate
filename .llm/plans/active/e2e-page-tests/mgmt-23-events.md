# E2E: Management-web – Events

## Route

(main)/events; query params: page, limit, sort (e.g. newest, oldest), search.

## Layout conditions to test

- Initial load: wait for table or loading to settle before asserting rows.
- Page title (e.g. "Events"); table columns (actor, action, target, timestamp, details).
- Sort select (newest/oldest); search input; pagination (page, total, limit).
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with event_visibility allowing list:** Events load; rows according to visibility (own, all_admins, all).
- **Unauthenticated:** Redirect to login.
- **No permission or event_visibility own with no events:** Empty list or restricted rows.
- **Super admin:** Typically sees all events.

## Values / display conditions

- Rows match management_event API; actor display name, action, target type/id, timestamp, details.
- Timestamps formatted correctly (locale).
- Sort: newest first vs oldest first; order correct.
- Search: filters by actor, action, target, or details per API; results match.
- Pagination: page, limit, total, totalPages correct; next/prev work.
- Empty state when no events (or no visible events).

## CRUD

- **Read only:** Events are audit log; no create/update/delete from UI.
- **Read:** List from management API; scoped by event_visibility and permissions.

## Functionality / interactions

- Sort change: URL and list update; no full page reload if SPA behavior.
- Search: input triggers fetch; URL params updated; no infinite loop.
- Pagination: click page or next/prev; list updates; URL reflects page.
- Refresh: URL params (page, sort, search) preserved; list state same after reload.
- Super admin vs non–super admin: event list scoped by event_visibility (own, all_admins, all).
- No edit/delete actions on events.

## Edge / error states

- API error: "Failed to load events" or equivalent; table not broken.
- Empty list: empty message.
- Permission denied: 403 or empty/restricted list.
- Invalid page param: fallback to page 1 or 404 per app.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed management_event rows; assert list shows events, sort and pagination work, and event_visibility filters correctly for non–super admin.
