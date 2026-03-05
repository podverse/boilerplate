# E2E: Web – Profile

## Route

(main)/profile.

## Layout conditions to test

- Page performs redirect only (profile redirects to settings in current app).
- No dedicated profile layout; no infinite redirect.

## Auth / redirect conditions

- **Authenticated user:** Visiting /profile redirects to settings (e.g. /settings or /settings?tab=profile).
- **Unauthenticated user:** Redirect to login (settings requires auth, so may redirect from profile or from settings).
- **Redirect target:** Final URL is settings (or login if not authenticated); single redirect.

## Values / display conditions

- N/A (redirect-only).

## CRUD

- N/A.

## Functionality / interactions

- Single navigation to /profile results in one redirect to settings (or login); no loop.

## Edge / error states

- Same as settings for auth and session.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Test with logged-in user; assert redirect to settings.
