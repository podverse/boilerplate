# E2E: Management-web – Login

## Route

(auth)/login; optional returnUrl (safe relative path).

## Layout conditions to test

- Login form: email and password inputs, submit button.
- Links (e.g. back to main app or help) if present.
- Form title (e.g. "Log in"); minimal nav (management auth).
- Loading state on submit; rate limit modal or message when 429.

## Auth / redirect conditions

- **Unauthenticated:** Form visible; submit triggers management login.
- **Valid credentials (management admin):** Login success; redirect to returnUrl (if safe) or dashboard; management session established.
- **Invalid credentials:** Error message (e.g. "Invalid email or password"); no redirect; form retained.
- **Main app user (not management admin):** Login fails with invalid credentials or "not an admin" message; no session.
- **Already authenticated:** Visiting /login redirects to dashboard or returnUrl.
- **returnUrl validation:** Safe relative path only; otherwise default redirect.
- **Rate limited (429):** Modal or message with retry-after; no redirect.

## Values / display conditions

- Error message matches API (e.g. loginFailed translation).
- After success: redirect URL matches returnUrl or dashboard.
- Labels and placeholders from i18n.

## CRUD

- N/A (auth only).

## Functionality / interactions

- Email and password required; empty submit shows validation or API error.
- Submit: loading state; success → redirect; failure → error message.
- Accessibility: labels for inputs; submit on Enter; primary actions focusable via keyboard.
- No password or token echoed in DOM, URL, or error message; session cookie set on success; subsequent requests authenticated for management-api.

## Edge / error states

- 401: invalid credentials message.
- 429: rate limit message/modal; retry-after shown.
- Network error: appropriate message; form retained.
- Malicious returnUrl: ignored; redirect to default.
- Main app user attempting management login: clear failure (no admin account).

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login with e2e-superadmin@example.com / Test!1Aa → success and redirect to dashboard; wrong password → error; optional returnUrl → redirect after login.
