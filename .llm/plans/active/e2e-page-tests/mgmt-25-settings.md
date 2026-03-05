# E2E: Management-web – Settings

## Route

(main)/settings; optional tab or section (e.g. profile, password).

## Layout conditions to test

- Tabs or sections: Profile, Password (and optionally API tokens, sessions).
- Active tab content: profile (display name, email), password (current, new, confirm).
- Save/update buttons per section; main nav visible.

## Auth / redirect conditions

- **Authenticated admin:** Settings load; all tabs accessible.
- **Unauthenticated:** Redirect to login.
- **Tab param:** Correct tab shown; invalid tab falls back to default.

## Values / display conditions

- Profile: display name and email match current admin; after update, values persist.
- Password: no pre-filled passwords; email read-only or editable per design.
- After update: success feedback; displayed values update.

## CRUD

- **Read:** Admin profile from API.
- **Update (profile):** Display name; save persists.
- **Update (password):** Current password validated; new password meets policy; save persists; re-login with new password works.
- **Update (email if supported):** New email with verification or immediate update; no duplicate.

## Functionality / interactions

- Tab switch: URL updates; correct content visible.
- Profile save: validation; loading state; success or error message. Double-click save: only one update. No password echoed in DOM or error message.
- Password save: current required; new password policy and confirm; success; re-login works.
- Links (tokens, sessions): navigate correctly if present.
- Cancel or back: no unintended save.

## Edge / error states

- Invalid current password: error message; no update.
- New password policy not met: validation errors.
- API error: message; form retained.
- Session expired: redirect to login on save or next action.
- Duplicate email: error message.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login as e2e-superadmin; assert profile tab; test one profile and one password update round-trip.
