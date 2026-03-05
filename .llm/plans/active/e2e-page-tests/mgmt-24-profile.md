# E2E: Management-web – Profile

## Route

(main)/profile.

## Layout conditions to test

- Profile content: display name, email (read-only or editable); or redirect to settings.
- If profile is separate from settings: form to update display name; main nav visible.
- If profile redirects to settings: same as mgmt-25 (redirect only; no infinite loop).

## Auth / redirect conditions

- **Authenticated admin:** Profile loads or redirects to settings with profile tab.
- **Unauthenticated:** Redirect to login.
- **If redirect:** Single redirect to settings (or settings?tab=profile); no loop.

## Values / display conditions

- Display name and email match current management admin (e.g. e2e-superadmin@example.com, E2E Super Admin).
- After update (if editable): values persist; next load shows updated data.

## CRUD

- **Read:** Current admin data from API.
- **Update (if editable):** Display name or email change; save persists.

## Functionality / interactions

- If profile page: edit display name; save with loading state; success feedback. Double-click save: only one update.
- If redirect: navigate to profile → land on settings; profile tab or section visible.
- Link to settings (if separate): navigates to settings.
- No password or token exposure.

## Edge / error states

- API error on save: message; form retained.
- Session expired: redirect to login.
- Duplicate display name (if unique): error message.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login as e2e-superadmin; assert profile shows correct identity; if editable, test one update.
