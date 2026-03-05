# E2E: Management-web – Edit user

## Route

(main)/user/[id]/edit.

## Layout conditions to test

- Form: display name, email (if editable), or password change.
- Save and cancel/back; user context visible.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with users update:** Form loads; save allowed.
- **Unauthenticated:** Redirect to login.
- **Invalid user id:** notFound (404).
- **No permission:** 403 or redirect.

## Values / display conditions

- Form pre-filled with current user (display name, email); no password pre-filled.
- After save: user detail and list show updated data.
- Password change (if present): current password or admin override; new password persists.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Save display name/email persists; password change (if supported) persists; re-login with new password works.

## Functionality / interactions

- Display name: validation (length); save with loading state; success feedback. Double-click save: only one update. Browser back after save: no duplicate submit. No password echoed in DOM or error message.
- Email change (if supported): validation and uniqueness; verification flow or immediate update.
- Password change (if present): new password policy; confirm; save; user can log in with new password.
- Cancel → user detail or users list.
- Validation errors shown; form retained on error.

## Edge / error states

- API error: message; form retained.
- Duplicate email: error message.
- Invalid user id: notFound.
- Permission denied: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Edit seeded user; change display name; assert persistence and no password leak.
