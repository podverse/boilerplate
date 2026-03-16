# E2E: Web – Forgot password – Detailed Plan

## Route and objective

- **Route:** `(auth)/forgot-password`.
- **Objective:** Verify forgot-password form submits email, shows success or error, and does not leak existence of email; optional rate limiting.

## Selector strategy

- Email input: `getByRole('textbox', { name: /email/i })` or `getByLabel(/email/i)`.
- Submit: `getByRole('button', { name: /send|submit|reset password/i })`.
- Link back: `getByRole('link', { name: /log in|back/i })`.
- Success/error message: `getByRole('alert')` or region with status text.

## Assertion matrix

### Layout

- Form: single email input (or email/username), submit button.
- Link to login (or back).
- Success state: message like "If an account exists, we sent a link" (generic to avoid email enumeration).
- Loading state on submit.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Unauthenticated | Load /forgot-password | Form visible. |
| Valid email (exists) | Submit e2e@example.com | Success message (generic); no indication whether email exists. |
| Invalid/unknown email | Submit unknown@example.com | Same generic success message (no email enumeration). |
| Already authenticated | Visit /forgot-password | May redirect to dashboard or show form. |

### Values / display

- Success message: same for known and unknown email (security).
- Error: rate limit or network error message when applicable.
- No email echoed in error message.

### Interaction

- Empty submit: validation error (email required).
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); then success message or error.
- Log in link → /login.
- Double submit: button disabled during request.
- Accessibility: primary actions (submit, log in link) focusable; tab order reasonable.

## CRUD

- N/A (triggers email send; no direct CRUD assertion).

## Edge / error states

- 429 rate limit: message with retry-after.
- Network error: message; form retained.
- Invalid email format: validation error.

## Test data mapping

- Use seeded e2e@example.com for "valid" path (still generic success message).
- Use non-existent email for "unknown" path; assert same success message.

## Screenshot and trace checkpoints

- Form: "forgot-password-form-loaded".
- After submit: "forgot-password-success-message".
- Validation/error: "forgot-password-validation-or-error".

## Verification commands

- `make e2e_test_web` with forgot-password spec.
- Mailer may be disabled; success message still shown without sending.

## Implementation notes

- Spec: `apps/web/e2e/forgot-password.spec.ts` or auth.spec.ts.
- Page: `apps/web/src/app/(auth)/forgot-password/page.tsx`.
