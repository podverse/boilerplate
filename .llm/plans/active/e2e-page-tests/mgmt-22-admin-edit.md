# E2E: Management-web – Edit admin

## Route

(main)/admin/[id]/edit.

## Layout conditions to test

- Form: display name, permission toggles (admins_crud, users_crud, buckets_crud, bucket_messages_crud, bucket_admins_crud), event_visibility.
- Password change (optional): new password, confirm.
- Save and cancel; admin context visible; main nav visible.

## Auth / redirect conditions

- **Authenticated admin with admins update:** Form loads; save allowed.
- **Unauthenticated:** Redirect to login.
- **Invalid admin id:** notFound (404).
- **No permission:** 403 or redirect.
- **Editing super admin:** May restrict who can edit (e.g. only super admin); or restrict removing super_admin flag.

## Values / display conditions

- Form pre-filled with current display name and permissions; no password pre-filled.
- After save: admin detail and list show updated permissions and display name.
- Password change (if present): new password persists; admin can log in with new password.
- Super admin: is_super_admin read-only or not editable by others.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Save permissions and display name persists; password change persists if supported.

## Functionality / interactions

- Toggle each permission; event_visibility select; save with loading state; success feedback. Double-click save: only one update. Browser back after save: no duplicate submit.
- Display name: validation (unique, length); save persists.
- Password change: policy and confirm; save; admin re-login works.
- Cancel → admin detail or admins list.
- Validation errors shown; form retained on error.

## Edge / error states

- API error: message; form retained.
- Invalid admin id: notFound.
- Permission denied: 403.
- Editing own permissions (when restricted): blocked or clear message.
- Last super admin: cannot demote or delete; validation or disabled control.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Edit seeded admin; change display name and one permission; assert persistence.
