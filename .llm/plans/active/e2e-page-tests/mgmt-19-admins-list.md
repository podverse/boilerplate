# E2E: Management-web – Admins list

## Route

(main)/admins.

## Layout conditions to test

- Initial load: wait for list or loading to settle before asserting rows.
- Page title (e.g. "Admins"); table (email, display name, super admin flag, permissions summary).
- "New admin" or "Create admin" CTA when permitted; search/filter if present.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with admins read:** List loads; create link if has admins create.
- **Unauthenticated:** Redirect to login.
- **No permission:** 403 or redirect.
- **Event visibility:** List may show only own admin for limited visibility; super admin sees all.

## Values / display conditions

- Rows match management API (management_user, credentials, bio, permissions).
- Super admin indicated; other admins show permission summary or roles.
- Empty state when no admins (except super admin); create CTA when permitted.
- Search/filter: results match; URL params updated.

## CRUD

- **Read:** List from management API.
- **Create:** New admin link → (main)/admins/new.

## Functionality / interactions

- Search: filters list; no infinite loop.
- Row click or link → admin detail with correct id.
- Create admin → new admin form.
- Edit link → admin edit.
- Refresh: URL params preserved; list state same after reload.
- Super admin sees all admins; non–super admin may see restricted set per event_visibility.

## Edge / error states

- API error: message; table not broken.
- Empty list (except super admin): empty message.
- Permission denied: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Assert super admin (e2e-superadmin@example.com) in list; create one admin and see in list when permitted.
