# E2E: Management-web – Dashboard – Detailed Plan

## Route and objective

- **Route:** `(main)/dashboard`.
- **Objective:** Verify dashboard shows admin identity, main nav (Buckets, Users, Admins, Events, Profile, Settings, Log out), and nav scoped by permissions (super admin vs non–super admin with event_visibility).

## Selector strategy

- Heading: `getByRole('heading', { name: /dashboard/i })`.
- Admin identity: text with display name or username (e2e-superadmin@example.com or "E2E Super Admin").
- Nav: `getByRole('navigation')` and links (Buckets, Users, Admins, Events, Profile, Settings, Log out).
- Super admin sees full nav; non–super admin sees subset per permissions and event_visibility.

## Assertion matrix

### Layout

- Initial load: wait for greeting/content before asserting.
- Dashboard heading and greeting or summary.
- Main admin nav visible; signed-in admin identity visible.
- No layout shift when data loads.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated super admin | Load dashboard | Full nav (Buckets, Users, Admins, Events, Profile, Settings); content visible. |
| Authenticated non–super admin | Load dashboard | Nav and data scoped by permissions and event_visibility. |
| Unauthenticated | Load dashboard | Redirect to /login. |
| After login | Login then land | Redirect to dashboard with correct admin info. |

### Values / display

- Greeting/name matches admin from seed (e.g. e2e-superadmin@example.com or display name).
- Title/heading matches translation.

### Interaction

- Nav links → correct routes (Buckets, Users, Admins, Events, Profile, Settings).
- Log out → session cleared; redirect to login.
- No broken or duplicate links.
- Accessibility: primary actions (nav links) focusable; tab order reasonable.

## CRUD

- N/A (read-only dashboard).

## Edge / error states

- Expired session: redirect to login.
- API failure: error or fallback; no uncaught exception.

## Test data mapping

- **Super admin:** e2e-superadmin@example.com / Test!1Aa; assert full nav and identity.
- **Non–super admin (optional):** Admin with limited permissions; assert nav subset and event_visibility scoping.

## Screenshot and trace checkpoints

- Dashboard loaded: "mgmt-dashboard-with-identity".
- After login: "mgmt-dashboard-after-login".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; dashboard spec.

## Implementation notes

- Spec: `apps/management-web/e2e/dashboard.spec.ts`.
- Page: `apps/management-web/src/app/(main)/dashboard/page.tsx`.
- Test: unauthenticated redirect; super admin full nav; optional non–super admin scoping.
