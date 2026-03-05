# E2E: Management-web – Edit bucket admin

## Route

(main)/bucket/[id]/settings/admins/[userId]/edit.

## Layout conditions to test

- Form: permission toggles or bitmasks (bucket CRUD, message CRUD, admin CRUD).
- Admin identity (email/user) read-only; save and cancel.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with admin_crud update:** Form loads; save allowed.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket or userId:** notFound (404).
- **No permission:** 403 or redirect.

## Values / display conditions

- Admin email/name matches userId; current permissions pre-filled.
- After save: permissions persist; bucket admins list shows updated role.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Save persists admin_permissions; list and next edit show new values.
- **Remove (if supported):** Delete admin; admin removed from list.

## Functionality / interactions

- Toggle permissions; save with loading state; success or error message. Double-click save: only one update. Browser back after save: no duplicate submit.
- Remove admin (if supported): confirmation dialog; cancel leaves admin; confirm removes admin from list.
- Cancel → bucket settings or admins list.
- Validation: e.g. at least read on admins; error if invalid.

## Edge / error states

- API error: message; form retained.
- Invalid userId: notFound.
- Editing own permissions (when restricted): blocked or clear message.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed bucket with admin; open edit; assert pre-fill and one update round-trip.
