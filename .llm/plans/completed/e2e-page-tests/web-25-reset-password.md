# E2E: Web – Reset password – Detailed Plan

## Route and objective

- **Route:** `(auth)/reset-password` (typically with token in query or path, e.g. ?token=...).
- **Objective:** Verify reset-password form with valid/invalid/expired token, password validation, and success redirect to login.

## Selector strategy

- New password: `getByLabel(/new password|password/i)` (first).
- Confirm password: `getByLabel(/confirm|repeat password/i)` or second password field.
- Submit: `getByRole('button', { name: /reset|submit|save/i })`.
- Error/alert: `getByRole('alert')` or status region.
- Link: `getByRole('link', { name: /log in|forgot/i })`.

## Assertion matrix

### Layout

- Form: new password, confirm password, submit button.
- Or single password field if no confirm in app.
- Loading state on submit.
- Success: redirect to login or success message.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Valid token (query/path) | Load reset-password?token=... | Form visible; submit updates password and redirects to login. |
| Invalid token | Load with bad token | Error "Invalid or expired link" (or equivalent); form may be hidden. |
| Expired token | Load with expired token | Same as invalid; clear message. |
| No token | Load /reset-password | Form still renders with empty token field or token-required state; submit shows token-required validation rather than silently succeeding. |
| Already authenticated | Visit with valid token | May redirect or show form; submit still updates password. |

### Values / display

- Password validation: min length, complexity; confirm match.
- Error messages: invalid/expired link; validation errors.
- Token field/value handling is visible enough to assert token-required validation when missing.
- No token or password in URL after submit; no raw token in error message.

### Interaction

- Empty password: validation error.
- Password too weak: validation error.
- Confirm password different from new password: validation error shown; submit blocked.
- Missing token on submit: token-required validation shown; form remains.
- Valid submit: assert primary button disabled or shows loading during request; re-enables after success or error; success → redirect to login; user can log in with new password.
- Rate limit (429): rate-limit modal/message shown; form remains in place.
- Log in link → /login.
- Double submit: button disabled during request.
- Accessibility: primary actions (submit, log in link) focusable; tab order reasonable.

## CRUD

- **Update (password):** Valid token + valid new password → password updated; old password invalid; new password works at login.

## Edge / error states

- Invalid/expired token: clear message; no crash.
- Network error: message; form retained.
- Token replay: after successful reset, same token invalid (if one-time).

## Test data mapping

- **Valid token:** Obtain from forgot-password flow (call API or use seeded reset token if available).
- **Invalid token:** Use literal "invalid" or expired token from seed.
- **New password:** Meet policy (e.g. Test!1Aa or equivalent); assert login with new password after reset.

## Screenshot and trace checkpoints

- Form with valid token: "reset-password-form-loaded".
- Invalid token: "reset-password-invalid-or-expired".
- Validation error: "reset-password-validation".
- Success redirect: "reset-password-success-redirect-to-login".

## Verification commands

- `make e2e_test_web` with reset-password spec.
- Requires way to get valid token (forgot-password flow or test-only token in seed).

## Implementation notes

- Spec: `apps/web/e2e/reset-password.spec.ts` or auth.spec.ts.
- Page: `apps/web/src/app/(auth)/reset-password/page.tsx`.
- Document how test obtains valid reset token (API helper or seed).
