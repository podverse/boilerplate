# E2E: Management-web – Settings – Detailed Plan

## Route and objective

- **Route:** `(main)/settings`; optional tab param (e.g. profile, password).
- **Objective:** Verify settings tabs load, profile/password updates persist, validation, and tab state in URL; unauthenticated redirect; super admin vs non–super admin if settings differ by permission.

## Selector strategy

- Tabs: `getByRole('tab')` or links with tab semantics (Profile, Password, etc.).
- Profile: display name, username (read-only or editable).
- Password: current, new, confirm; save button.
- Save: `getByRole('button', { name: /save|update/i })`.
- Success/error: `getByRole('alert')` or status region.

## Assertion matrix

### Layout

- Tabs or sections (Profile, Password, etc.); active tab content visible.
- Form fields per tab; save buttons; main nav; settings heading.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Load /settings | Tabs accessible; forms load. |
| Unauthenticated | Load /settings | Redirect to /login. |
| Tab param | ?tab=password | Correct tab active. |

### Values / display

- Profile: display name and username match current admin (seed).
- Password: no pre-filled passwords.
- After update: success message; displayed values update.

### Interaction

- Tab switch: URL updates; correct content; no data loss.
- Profile save: assert submit disabled or shows loading during request; re-enables after success or error; validation; success or error.
- Password save: current required; new password validation and confirm match; confirm password different from new password: validation error shown, submit blocked; assert submit disabled or shows loading during request; re-enables after success or error; success; re-login with new password works.
- Double-click save: only one update.
- Accessibility: primary actions (save buttons, tab links) focusable; tab order reasonable.

## CRUD

- **Read:** Admin profile from API.
- **Update (profile):** Change display name; save persists.
- **Update (password):** Current validated; new meets rules; save persists; re-login works.

## Edge / error states

- Invalid current password: error; no update.
- New password fails policy: validation errors.
- API error: error; form retained.
- Session expired: redirect on save or next action.

## Test data mapping

- **Seeded admin:** e2e-superadmin@example.com; assert profile tab shows correct name/username.
- **Password update:** New password meeting policy; assert login with new password.

## Screenshot and trace checkpoints

- Settings loaded: "mgmt-settings-tabs".
- After profile save: "mgmt-settings-profile-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; settings spec.

## Implementation notes

- Spec: `apps/management-web/e2e/settings.spec.ts`.
- Page: `apps/management-web/src/app/(main)/settings/page.tsx` (and SettingsContent).
- Test: unauthenticated redirect; tab switching; one profile and one password update round-trip.
