# E2E: Web – Home (redirect)

## Route

(main)/ — root path.

## Layout conditions to test

- No dedicated layout; page performs redirect only. No infinite redirect loop (max one redirect per load).

## Auth / redirect conditions

- **Authenticated user:** Visiting `/` redirects to dashboard (e.g. `/dashboard`) without showing home content.
- **Unauthenticated user:** Visiting `/` redirects to login (e.g. `/login`) without showing home content.
- **Redirect target:** Final URL is either dashboard or login; no intermediate flash of wrong content.

## Values / display conditions

- N/A (redirect-only page; no persistent displayed values).

## CRUD

- N/A.

## Functionality / interactions

- Single navigation to `/` results in exactly one redirect; browser does not oscillate between routes.

## Edge / error states

- Session expiry or invalid cookie: redirect to login.
- Network failure during redirect: appropriate error or retry; no infinite loop.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Test both with seeded logged-in user and with no session.
