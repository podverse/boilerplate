# E2E: Web – Home (redirect) – Detailed Plan

## Route and objective

- **Route:** `(main)/` — root path.
- **Objective:** Ensure unauthenticated users are redirected to login and authenticated users to dashboard with no flash of wrong content or redirect loops.

## Selector strategy

- Prefer URL assertions (`toHaveURL`) and optional role/text for final destination (e.g. login form or dashboard heading).
- Avoid asserting on transient root content; assert only final route and one stable element on destination page.
- Use `page.goto('/')` then wait for navigation to settle (e.g. `waitForURL` or `expect.toHaveURL` with timeout).

## Assertion matrix

### Layout

- No dedicated layout for `/`; redirect occurs without rendering persistent root content.
- After redirect: either login page (form, "Log in" or equivalent) or dashboard (e.g. heading "Dashboard") is visible.
- No infinite redirect: at most one client-side redirect; no oscillation between routes.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Unauthenticated | Visit `/` | Redirect to `/login` (or path containing `/login`); login form or submit button visible. |
| Authenticated (seeded user) | Visit `/` | Redirect to `/dashboard` (or path containing `/dashboard`); dashboard heading or main content visible. |
| Session expired / invalid cookie | Visit `/` | Redirect to login. |
| Already on login/dashboard | N/A | Covered by above; no double redirect when coming from `/`. |

### Values / display

- N/A for root; assert only destination page shows expected one element (login CTA or dashboard title).

### Interaction

- Single navigation to `/`; no user interaction required for redirect.
- Browser back after redirect: back goes to previous history entry (e.g. external or login); no loop.
- Accessibility: primary links focusable; tab order reasonable.

## CRUD

- N/A.

## Edge / error states

- Network failure during redirect: appropriate error or retry; no uncaught exception in test.
- Slow auth check: redirect still completes within test timeout; no intermediate flash of dashboard for unauthenticated user.

## Test data mapping

- **Seeded user:** `e2e@example.com` / `Test!1Aa` (see [E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)).
- **Unauthenticated:** No session cookie; clear storage or use incognito context.
- **Authenticated:** Log in via login page or set session cookie before `goto('/')` if supported.

## Screenshot and trace checkpoints

- After redirect: one screenshot for "login-page-after-root-redirect" (unauthenticated) and one for "dashboard-after-root-redirect" (authenticated).
- On failure: capture trace; assert final URL and one visible element on destination.

## Verification commands

- `make e2e_test_web_home` (includes home spec).
- Run with E2E seed; no additional fixtures required for home redirect.

## Implementation notes

- Spec file: `apps/web/e2e/home.spec.ts`.
- Page under test: `apps/web/src/app/(main)/page.tsx` (redirect logic).
- Test both branches: one test unauthenticated redirect to login; one test authenticated redirect to dashboard (login first, then visit `/`).
