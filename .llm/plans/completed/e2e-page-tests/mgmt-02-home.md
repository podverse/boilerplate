# E2E: Management-web – Home (redirect) – Detailed Plan

## Route and objective

- **Route:** `(main)/` — root path.
- **Objective:** Unauthenticated redirect to management login; authenticated admin redirect to dashboard; no redirect loop.

## Selector strategy

- URL assertion: after `goto('/')`, expect URL to contain `/login` or `/dashboard`.
- Optional: one stable element on destination (login form or dashboard heading).

## Assertion matrix

### Layout

- Redirect only; no dedicated home layout; no infinite redirect.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Unauthenticated | Visit / | Redirect to /login; login form visible. |
| Authenticated admin/super admin | Visit / | Redirect to /dashboard; dashboard content visible. |
| Session expired / invalid cookie | Visit / | Redirect to /login. |

### Values / display

- N/A (redirect-only).

### Interaction

- Single navigation to / → one redirect; no oscillation.
- Accessibility: primary links focusable; tab order reasonable.

## CRUD

- N/A.

## Edge / error states

- Session expiry: redirect to login.
- Invalid cookie: redirect to login.

## Test data mapping

- **Seeded super admin:** e2e-superadmin@example.com / Test!1Aa (management seed).
- **Unauthenticated:** No session.
- Test both branches: unauthenticated → login; authenticated → dashboard.

## Screenshot and trace checkpoints

- After redirect: "mgmt-home-redirect-to-login" or "mgmt-home-redirect-to-dashboard".

## Verification commands

- `make e2e_test_management_web_home` (includes home spec).

## Implementation notes

- Spec: `apps/management-web/e2e/home.spec.ts`.
- Page: `apps/management-web/src/app/(main)/page.tsx`.
