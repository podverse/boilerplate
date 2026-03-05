# E2E: Management-web – Home (redirect)

## Route

(main)/.

## Layout conditions to test

- Redirect only; no dedicated home layout. No infinite redirect loop.

## Auth / redirect conditions

- **Authenticated admin/super admin:** Visiting / redirects to dashboard (e.g. /dashboard).
- **Unauthenticated:** Redirect to management login (e.g. /login).
- **Redirect target:** Final URL is dashboard or login; single redirect.

## Values / display conditions

- N/A (redirect-only).

## CRUD

- N/A.

## Functionality / interactions

- One redirect per load; no oscillation between routes.

## Edge / error states

- Session expiry: redirect to login.
- Invalid cookie: redirect to login.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Test with logged-in e2e-superadmin and with no session.
