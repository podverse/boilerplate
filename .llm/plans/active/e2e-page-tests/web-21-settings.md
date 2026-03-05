# E2E: Web – Settings

## Route

(main)/settings; optional query tab=general|profile|password|email.

## Layout conditions to test

- Tabs or sections: General, Profile, Password, Email (or equivalent).
- Active tab content visible; other tabs switch without full page reload when applicable.
- Form fields per tab: e.g. display name (profile), current password + new password (password), email change (email).
- Save/update buttons per section; main nav visible.
- Title or heading indicates settings.

## Auth / redirect conditions

- **Authenticated user:** Settings load; all tabs accessible.
- **Unauthenticated user:** Redirect to login; settings not visible.
- **Tab param:** ?tab=profile|password|email|general shows correct tab; invalid tab falls back to default (e.g. general).

## Values / display conditions

- Profile: display name and email (if shown) match current user from seed or API.
- General: any app preferences or locale reflect current user.
- Password/email: no pre-filled passwords; email shown read-only or in form per design.
- After update: success message or inline feedback; displayed values update.

## CRUD

- **Read:** User profile and preferences loaded from API.
- **Update (profile):** Change display name; save persists; next load shows new name.
- **Update (password):** Current password validated; new password meets rules; save persists; re-login with new password works.
- **Update (email):** Request email change; verification flow or success message; no duplicate email.

## Functionality / interactions

- Tab switch: URL updates (tab param); correct content visible; no data loss.
- Profile save: validation (e.g. display name length); loading state; success or error message.
- Password save: current password required; new password validation (length, rules); confirm password match; success and optional redirect to re-login.
- Email change: current password; new email validation and uniqueness; verification email or success message.
- Links (e.g. API tokens, sessions) if present: navigate correctly.

## Edge / error states

- Invalid current password: error message; no update.
- New password does not meet policy: validation errors shown.
- Email already in use: error message.
- API error on save: error message; form retained.
- Session expired during edit: redirect to login on save or next action.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login as e2e@example.com; assert profile tab shows correct name/email; test one profile and one password update round-trip.
