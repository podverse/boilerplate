# E2E: Web – Dashboard

## Route

(main)/dashboard.

## Layout conditions to test

- Initial load: wait for greeting/content to appear (or loading to settle) before asserting user identity.
- Page heading (e.g. "Dashboard") visible.
- Section with greeting/hello text and signed-in user identity (display name or email).
- Main app nav visible and indicates authenticated state.
- No layout shift or missing sections when data loads.

## Auth / redirect conditions

- **Authenticated user:** Dashboard loads; content visible.
- **Unauthenticated user:** Redirect to login; dashboard content not visible.
- **After login:** Redirect lands on dashboard with correct user info.

## Values / display conditions

- Greeting uses display name from seed when present (e.g. "E2E User"); fallback to email (e.g. "e2e@example.com").
- "Signed in as" or equivalent shows the authenticated user's email.
- Title/heading matches translation (e.g. "Dashboard").

## CRUD

- N/A (dashboard is read-only summary).

## Functionality / interactions

- Nav links (e.g. Buckets, Profile, Settings, Log out) are present and clickable.
- Clicking nav items navigates to correct routes without losing session.
- No duplicate or broken links.

## Edge / error states

- Expired session: redirect to login on next navigation or refresh.
- API failure loading user: appropriate error message or redirect; no uncaught exception in UI.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login as e2e@example.com / Test!1Aa; assert displayed name/email match seed.
