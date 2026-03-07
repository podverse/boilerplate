# E2E: Web – Settings – Detailed Plan

## Route and objective

- **Route:** `(main)/settings`; optional `?tab=general|profile|password|email` (or app equivalents).
- **Objective:** Verify all tabs load, profile/password/email updates persist, validation, and tab state in URL; unauthenticated redirect.

## Selector strategy

- Tabs: `getByRole('tab', { name: /general|profile|password|email/i })` or links with tab semantics.
- Profile: display name input, email (read-only or editable).
- Password: current password, new password, confirm; save button.
- Email: current password, new email; save or "Send verification".
- Save buttons: `getByRole('button', { name: /save|update/i })`.
- Success/error: `getByRole('alert')` or status region.

## Assertion matrix

### Layout

- Initial load: optionally assert loading or placeholder until settings/tabs load; then assert content replaces it (no permanent loading).
- Tabs or sections: General, Profile, Password, Email (or equivalents).
- General tab (if present): locale/language selector visible.
- Active tab content visible; switching tab updates content without full reload when applicable.
- Form fields per tab; save/update buttons per section; main nav; settings title/heading.
- Profile tab: email field read-only (disabled) when not in email-change flow; assert no accidental edit of email from profile tab.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Load /settings | All tabs accessible; forms load. |
| Unauthenticated | Load /settings | Redirect to login. |
| Tab param | ?tab=profile | Correct tab active; invalid tab → default. |

### Values / display

- Profile: display name and email match current user (seed).
- Password/email: no pre-filled passwords; email shown per design.
- Changing locale (General tab): persists (e.g. cookie); optional: reload or switch tab and assert labels reflect locale where applicable.
- After update: success message or feedback; displayed values update.

### Interaction

- Tab switch: URL updates (tab param); correct content; no data loss.
- Profile save: assert submit disabled or shows loading during request; re-enables after success or error; validation (e.g. display name length); success or error.
- Password save: current password required; new password validation and confirm match; confirm password different from new password: validation error shown, submit blocked; assert submit disabled or shows loading during request; re-enables after success or error; success; re-login with new password works.
- Email change: current password; new email validation and uniqueness; verification or success message.
- Links (API tokens, sessions) if present: navigate correctly.
- Accessibility: primary actions (save buttons, tab links) focusable; tab order reasonable; optional: Enter submits form, Escape closes modal/cancel.

## CRUD

- **Read:** User profile/preferences from API.
- **Update (profile):** Change display name; save persists; next load shows new name.
- **Update (password):** Current validated; new meets rules; save persists; re-login works.
- **Update (email):** Request change; verification or success; no duplicate email.

## Edge / error states

- Invalid current password: error; no update.
- New password fails policy: validation errors.
- Email already in use: error message.
- API error on save: error; form retained.
- Session expired: redirect to login on save or next action.

## Test data mapping

- **Seeded user:** e2e@example.com / Test!1Aa; display name from seed.
- **Profile update:** New display name; assert on reload.
- **Password update:** New password meeting policy; assert login with new password.
- **Email:** Use unique email for change; or assert duplicate error with e2e@example.com.

## Screenshot and trace checkpoints

- Settings loaded: "settings-tabs-visible".
- Profile tab: "settings-profile-tab".
- After profile save: "settings-profile-saved".
- Password tab validation: "settings-password-validation".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; settings spec after seed.

## Implementation notes

- Spec: `apps/web/e2e/settings.spec.ts`.
- Page: `apps/web/src/app/(main)/settings/page.tsx` (and tab content components).
- Test: unauthenticated redirect; tab switching and URL; one profile save; one password update round-trip; optional email and edge cases.
