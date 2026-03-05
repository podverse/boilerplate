# E2E: Management-web – Dashboard

## Route

(main)/dashboard.

## Layout conditions to test

- Initial load: wait for greeting/content to appear before asserting admin identity.
- Dashboard heading (e.g. "Dashboard") and greeting or summary content.
- Main admin nav visible (Buckets, Users, Admins, Events, Profile, Settings, Log out).
- Signed-in admin identity (display name or email) visible.
- No layout shift when data loads.

## Auth / redirect conditions

- **Authenticated admin/super admin:** Dashboard loads; nav and content visible.
- **Super admin vs non–super admin:** Super admin sees full nav (Buckets, Users, Admins, Events, etc.); non–super admin sees nav and data scoped by admin_permissions and event_visibility.
- **Unauthenticated:** Redirect to management login.
- **After login:** Redirect lands on dashboard with correct admin info.

## Values / display conditions

- Greeting/name matches admin from seed (e.g. "E2E Super Admin" or e2e-superadmin@example.com).
- Title/heading matches translation.

## CRUD

- N/A (read-only dashboard).

## Functionality / interactions

- Nav links (Buckets, Users, Admins, Events, Profile, Settings) navigate to correct routes.
- Log out: clears session; redirect to login.
- No broken or duplicate links.

## Edge / error states

- Expired session: redirect to login on next action.
- API failure: appropriate error or fallback; no uncaught exception.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Login as e2e-superadmin@example.com / Test!1Aa; assert displayed identity and nav.
