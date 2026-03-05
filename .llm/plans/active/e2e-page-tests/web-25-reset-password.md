# E2E: Web – Reset password

## Route

(auth)/reset-password; token in query (e.g. ?token=...) or path.

## Layout conditions to test

- Form: new password, confirm password (and optional token in URL).
- Submit button; link to Log in.
- When token invalid/expired: error message (e.g. "Invalid or expired link"); no form or form disabled.
- Loading state on submit.
- Success: redirect to login or success message.

## Auth / redirect conditions

- **Valid token (not expired):** Form visible; submit updates password and invalidates token.
- **Invalid or expired token:** Error message; form not usable or not shown; link to request new reset.
- **Missing token:** Error or redirect to forgot-password.
- **After successful reset:** Redirect to login; old token no longer works; new password works at login.
- **Already used token:** Same as expired; error message.

## Values / display conditions

- Password policy validation (length, rules); confirm match.
- Error message for invalid/expired link (i18n).
- Success message or redirect to login after submit.

## CRUD

- **Update (password):** Submit valid new password with valid token → password updated; token consumed; login with new password works.

## Functionality / interactions

- New password and confirm: both required; match validation; policy validation.
- Submit: loading state; success → redirect to login or message; failure → error (invalid token, weak password).
- Log in link → login page.
- Request new link → forgot-password.

## Edge / error states

- Invalid token: "Invalid or expired link" (or translated); no password update.
- Expired token: same as invalid.
- Password too weak: validation error.
- Confirm mismatch: validation error.
- Token in URL: not leaked in referrer or logs (HTTPS); consumed after use. No new password echoed in DOM or error message.
- Double use of same token: second submit fails; error or redirect.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Obtain valid reset token (via API or mailer mock); load reset page with token; submit new password; assert redirect and login with new password. Test invalid and expired tokens show error.
