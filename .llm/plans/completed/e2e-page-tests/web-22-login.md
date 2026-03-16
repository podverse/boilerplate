# E2E: Web – Login – Detailed Plan

## Route and objective

- **Route:** `(auth)/login`; optional query `returnUrl` (safe relative path).
- **Objective:** Verify login form behavior, credential validation, redirect after success, rate limiting, and that authenticated users are redirected away.

## Selector strategy

- Use `getByRole('textbox', { name: /email|username/i })` and `getByLabel(/password/i)` for inputs.
- Use `getByRole('button', { name: /log in|sign in|submit/i })` for submit.
- Use `getByRole('link', { name: /sign up|forgot password/i })` for links.
- Prefer role + accessible name; avoid raw placeholder text if labels exist.
- For error messages: `getByRole('alert')` or region with error text.

## Assertion matrix

### Layout

- Login form visible: email/username input, password input, submit button.
- Links present: Sign up, Forgot password (when implemented).
- Form title or heading (e.g. "Log in"); auth layout (no main app nav or minimal).
- Loading state on submit: button disabled or spinner visible during request.
- Rate limit modal: when 429 returned, modal or inline message with retry-after.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Unauthenticated | Load /login | Form visible; submit triggers login. |
| Valid credentials (seeded) | Submit e2e@example.com / Test!1Aa | Success; redirect to default (e.g. /dashboard) or returnUrl when safe; session established. |
| Invalid credentials | Submit wrong password | Error message (e.g. "Invalid email or password"); no redirect; form retained. |
| Already authenticated | Visit /login | Redirect to dashboard or returnUrl. |
| returnUrl safe | Login with ?returnUrl=/dashboard | Redirect to /dashboard after success. |
| returnUrl malicious | Login with ?returnUrl=//evil.com | returnUrl ignored; redirect to default (e.g. /dashboard). |
| Rate limited (429) | Submit until 429 | Modal or message with retry-after; form retained; no redirect. |

### Values / display

- Error message text matches API/translations (e.g. AUTH_MESSAGE_LOGIN_FAILED).
- Placeholders/labels from i18n (email, password, Log in).
- No password or token in DOM, URL, or error message; session cookie set on success.

### Interaction

- Empty submit: validation or API error; no redirect.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); success → redirect; failure → error message.
- Sign up link → /signup; Forgot password → /forgot-password.
- Accessibility: primary actions (submit, links) focusable; tab order reasonable; optional: Enter submits form.
- Double submit: button disabled during request; only one login attempt.

## CRUD

- N/A (auth only).

## Edge / error states

- 401: invalid credentials message shown.
- 429: rate limit modal/message; retry-after displayed.
- Network error: appropriate message; form retained.
- Malicious returnUrl: ignored; redirect to default.

## Test data mapping

- **Valid login:** e2e@example.com / Test!1Aa (seeded user).
- **Invalid:** wrong password or non-existent email → error.
- **returnUrl:** use ?returnUrl=/dashboard and ?returnUrl=/buckets for safe; ?returnUrl=//evil.com for unsafe.

## Screenshot and trace checkpoints

- Initial form: "login-form-loaded".
- After failed login: "login-error-invalid-credentials".
- After success (redirect): capture destination (dashboard).
- Rate limit: "login-rate-limited-modal" (if testing 429).
- On failure: full trace and screenshot at assertion point.

## Verification commands

- `make e2e_test_web` or run `apps/web/e2e/` with login spec.
- Ensure API and seed available; MAILER_ENABLED not required for login.

## Implementation notes

- Spec: `apps/web/e2e/login.spec.ts` (or add to auth.spec.ts).
- Page: `apps/web/src/app/(auth)/login/page.tsx`.
- Test cases: unauthenticated form; valid login redirect; invalid credentials; returnUrl safe and unsafe; optional rate limit and already-authenticated redirect.
