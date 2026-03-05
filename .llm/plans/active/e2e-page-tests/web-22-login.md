# E2E: Web – Login

## Route

(auth)/login; optional query returnUrl (safe relative path).

## Layout conditions to test

- Login form: email and password inputs, submit button.
- Links: Sign up, Forgot password (when present).
- Form title (e.g. "Log in"); no app nav or minimal auth nav.
- Rate limit modal when 429 returned; retry-after displayed.
- Loading state on submit (button disabled or spinner).

## Auth / redirect conditions

- **Unauthenticated user:** Form visible; submit triggers login.
- **Valid credentials:** Login success; redirect to returnUrl when safe (e.g. ?returnUrl=/dashboard) or to default (e.g. /dashboard); session established.
- **Invalid credentials:** Error message (e.g. "Invalid email or password" or translated); no redirect; form retained.
- **Already authenticated:** Visiting /login redirects to dashboard or returnUrl (app-dependent).
- **returnUrl validation:** returnUrl must be relative and not //; otherwise ignore and use default.
- **Rate limited (429):** Modal or message with retry-after; no redirect; form retained.

## Values / display conditions

- Error message text matches API (e.g. loginFailed translation for AUTH_MESSAGE_LOGIN_FAILED).
- After success: redirect URL matches returnUrl (if safe) or dashboard.
- Placeholders and labels from i18n (e.g. email, password, Log in).

## CRUD

- N/A (auth only).

## Functionality / interactions

- Email and password required; empty submit shows validation or API error.
- Submit: loading state; success → redirect; failure → error message.
- Sign up link → signup page.
- Forgot password link → forgot-password page.
- Rate limit modal: close or wait; no infinite retry during cooldown.
- Accessibility: labels associated with inputs; submit on Enter; primary actions focusable via keyboard.
- No password or token echoed in DOM, URL, or error message; session cookie set on success.

## Edge / error states

- 401: invalid credentials message.
- 429: rate limit modal/message; retry-after shown.
- Network error: appropriate message; form retained.
- Malicious returnUrl (e.g. //evil.com): ignored; redirect to default.
- Session cookie set on success; subsequent requests authenticated.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login with e2e@example.com / Test!1Aa → success and redirect; wrong password → error; optional returnUrl → redirect to that path after login.
