# E2E: Web – Forgot password

## Route

(auth)/forgot-password.

## Layout conditions to test

- Form: email input, submit button.
- Link back to Log in.
- Success message (e.g. "If an account exists, we've sent a reset link") or error message.
- Loading state on submit.
- No disclosure of whether email exists (success message same for valid/invalid email when applicable).
- No token or password in DOM or error message (token sent by email only).

## Auth / redirect conditions

- **Any user (authenticated or not):** Form visible; submit sends reset email when mailer enabled and email exists.
- **Success:** Message shown (generic to avoid email enumeration); no redirect or redirect to login.
- **Mailer disabled:** 403 or error from API; message shown; no email sent.
- **Invalid email format:** Validation error; no submit or API error.

## Values / display conditions

- Success message text matches app (i18n).
- Error message when API fails or mailer disabled.
- Email field: accepts valid format; validation on submit.

## CRUD

- N/A (triggers send of reset email/token; token created server-side).

## Functionality / interactions

- Email required; format validated.
- Submit: loading state; success message or error; form cleared or retained per design.
- Log in link → login page.
- Rate limiting (if present): too many requests show message or 429 handling.

## Edge / error states

- 403 (mailer disabled): clear message.
- 429: rate limit message.
- Network error: error message; form retained.
- No email enumeration: success message does not reveal if email exists (when policy is to hide).

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Submit e2e@example.com when mailer mocked or disabled → expect success message or 403; verify link to login and no crash.
