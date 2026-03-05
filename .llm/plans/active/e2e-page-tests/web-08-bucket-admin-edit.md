# E2E: Web – Edit bucket admin

## Route

(main)/bucket/[id]/settings/admins/[userId]/edit.

## Layout conditions to test

- Form to edit admin permissions (e.g. bucket CRUD, message CRUD, admin CRUD bitmasks or toggles).
- Admin identity shown (email or user id); read-only.
- Save and cancel/back buttons visible.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with admin-management permission:** Form loads; save allowed.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket id or userId:** notFound (404).
- **No permission to edit this admin:** 403 or redirect; form not editable.

## Values / display conditions

- Admin email/display name matches userId from seed or API.
- Current permission toggles/values match stored admin_permissions for this bucket and user.
- Bucket context (name or breadcrumb) visible.

## CRUD

- **Read:** Form pre-filled with current permissions.
- **Update:** Changing permissions and saving persists; bucket admin list and next edit load show new values.
- **Remove admin (if supported):** Delete/remove action; admin no longer in list.

## Functionality / interactions

- Toggle or select each permission; save → success and persisted.
- Save button: loading state; disable double submit. Double-click save: only one update. Browser back after save: no duplicate submit.
- Cancel/back → bucket settings or admins list without saving.
- Validation: at least read on admins or required bits enforced; error shown if invalid.

## Edge / error states

- API error on save: error message; form state retained.
- Editing own permissions (when restricted): blocked or clear message.
- Invalid userId: notFound.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed a bucket with an admin; open edit for that admin; assert displayed permissions and one update round-trip.
