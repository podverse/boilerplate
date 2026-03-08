# E2E: Web – Sign up – Detailed Plan

## Route and objective

- **Route:** `(auth)/signup`.
- **Objective:** Verify signup form validation, successful account creation (or verification flow), duplicate-email handling, and signup-disabled (403) behavior.

## Selector strategy

- Username: `getByRole('textbox', { name: /username/i })` or `getByLabel(/username/i)`.
- Email: `getByRole('textbox', { name: /email/i })` or `getByLabel(/email/i)`.
- Password: `getByLabel(/password/i)` (first one for password, second for confirm if present).
- Display name: `getByLabel(/display name|name/i)` if present.
- Submit: `getByRole('button', { name: /sign up|create account|submit/i })`.
- Link: `getByRole('link', { name: /log in/i })`.
- Validation/error: `getByRole('alert')` or text content.

## Assertion matrix

### Layout

- Signup form: username, email, password, confirm password (if present), display name (if present).
- Submit button; "Log in" link.
- Validation messages for username, email format, password policy, confirm match.
- Loading state on submit (button disabled or spinner).
- Success: redirect to login or "check email" message or dashboard per app.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Unauthenticated | Load /signup | Form visible; submit creates account or returns 403 if signup disabled. |
| Valid submit (new email) | Submit valid data | Account created; redirect to login or "check email" or dashboard. |
| Already authenticated | Visit /signup | May redirect to dashboard. |
| Signup disabled (no mailer) | Submit | 403 from API; error message; no account created. |

### Values / display

- Validation: username required/duplicate/over-max-length → message; email format invalid → message; password too weak → message; confirm mismatch → message.
- Success: message or redirect per app (verification email sent vs immediate login); when signup returns an authenticated user, session is established and the app lands on `/dashboard`.
- API errors: duplicate username, duplicate email, policy violation, 403/429 displayed clearly.

### Interaction

- Required fields: username, email, password (and confirm); validation on submit or blur.
- Password policy: length/complexity; error messages clear.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); success → redirect or message; failure → error retained.
- Rate limit (429): rate-limit modal/message shown; form remains in place.
- Log in link → /login.
- Double submit: button disabled during request; only one account created.
- No password echoed in DOM, URL, or error message.
- Accessibility: primary actions (submit, log in link) focusable; tab order reasonable.

## CRUD

- **Create (user):** Valid submit → user and credentials created; verification token if mailer enabled.

## Edge / error states

- Duplicate email (e.g. e2e@example.com): error message; form retained.
- Duplicate username: error message; form retained.
- 403 (signup disabled): clear message; no account created.
- 429 rate limit: clear message/modal; no account created.
- Invalid email format: validation error.
- Password too weak: validation error.
- Network/API error: message; form retained.

## Test data mapping

- **New user:** Use unique username/email pair and valid password meeting policy.
- **Duplicate:** e2e@example.com (seeded) → duplicate error.
- **Signup disabled:** Ensure MAILER_ENABLED or signup flag false in test env for 403 test.

## Screenshot and trace checkpoints

- Form loaded: "signup-form-loaded".
- Validation error: "signup-validation-password" or "signup-validation-email".
- Duplicate error: "signup-error-duplicate-email".
- 403: "signup-disabled-message".
- Success: "signup-success-redirect" or "signup-check-email-message".

## Verification commands

- `make e2e_test_web`; ensure signup spec runs after seed.
- For 403 test: run with signup disabled or mock API.

## Implementation notes

- Spec: `apps/web/e2e/signup.spec.ts` or auth.spec.ts.
- Page: `apps/web/src/app/(auth)/signup/page.tsx`.
- API: signup may return 403 when mailer disabled; document in E2E-PAGE-TESTING.md.
