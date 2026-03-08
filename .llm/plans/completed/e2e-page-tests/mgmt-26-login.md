# E2E: Management-web – Login – Detailed Plan

## Route and objective

- **Route:** `(auth)/login`; optional returnUrl (safe relative path).
- **Objective:** Verify management login form, valid credentials (admin only) redirect to dashboard or returnUrl, invalid credentials and main-app-user rejection, rate limiting, already-authenticated redirect.

## Selector strategy

- Username: management uses username (not email) — `getByRole('textbox', { name: /username|email/i })` or `getByLabel`.
- Password: `getByLabel(/password/i)`.
- Submit: `getByRole('button', { name: /log in|sign in|submit/i })`.
- Links: back to main app or help if present.
- Error: `getByRole('alert')` or status text.
- Rate limit modal: when 429.

## Assertion matrix

### Layout

- Login form: username (management) and password; submit button.
- Form title "Log in"; minimal management auth nav.
- Loading state on submit; rate limit modal/message when 429.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Unauthenticated | Load /login | Form visible; submit triggers management login. |
| Valid credentials (management admin) | Submit e2e-superadmin@example.com / Test!1Aa | Success; redirect to returnUrl or dashboard; management session. |
| Invalid credentials | Submit wrong password | Error "Invalid email or password" or equivalent; no redirect. |
| Main app user (not management admin) | Submit main-app user | Fails; "not an admin" or invalid credentials; no session. |
| Already authenticated | Visit /login | Redirect to dashboard or returnUrl. |
| returnUrl safe | ?returnUrl=/dashboard | Redirect to /dashboard after login. |
| returnUrl malicious | ?returnUrl=//evil.com | Ignored; redirect to default. |
| Rate limited (429) | Submit until 429 | Modal/message with retry-after; form retained. |

### Values / display

- Error message matches API/translations.
- Labels/placeholders from i18n (username for management).
- No password in DOM, URL, or error; session cookie set on success for management-api.

### Interaction

- Username and password required; empty submit shows validation or API error.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); success → redirect; failure → error.
- Accessibility: primary actions (submit, links) focusable; tab order reasonable; optional: Enter submits form.
- Double submit: button disabled during request.

## CRUD

- N/A (auth only).

## Edge / error states

- 401: invalid credentials message.
- 429: rate limit message; retry-after shown.
- Network error: message; form retained.
- Malicious returnUrl: ignored.
- Main app user: clear failure (no admin account).

## Test data mapping

- **Valid:** e2e-superadmin@example.com / Test!1Aa (management seed; note management may use username field with same value).
- **Invalid:** Wrong password or main-app-only user.
- **returnUrl:** Safe path and //evil.com for validation.

## Screenshot and trace checkpoints

- Form: "mgmt-login-form-loaded".
- Error: "mgmt-login-error-invalid".
- Success redirect: capture destination.
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; login spec.

## Implementation notes

- Spec: `apps/management-web/e2e/login.spec.ts`.
- Page: `apps/management-web/src/app/(auth)/login/page.tsx`.
- Management auth uses username; ensure seed and tests use correct field (username).
