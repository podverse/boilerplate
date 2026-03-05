# E2E: Management-web – Create admin

## Route

(main)/admins/new.

## Layout conditions to test

- Form: email, password, display name; permission toggles (admins_crud, users_crud, buckets_crud, etc.) or event_visibility.
- Submit and cancel; main nav visible.

## Auth / redirect conditions

- **Authenticated super admin (or admin with admins create):** Form loads; submit allowed.
- **Unauthenticated:** Redirect to login.
- **No create permission:** 403 or redirect.
- **Non–super admin:** May not have access to this route.

## Values / display conditions

- After create: redirect to admins list or admin detail; new admin appears with submitted email and permissions.
- Permission toggles reflect chosen values; event_visibility (own, all_admins, all) selectable.
- Validation: email format, password policy, display name unique.

## CRUD

- **Create:** Valid submit → management_user, credentials, bio, admin_permissions created; redirect; new admin can log in to management-web.

## Functionality / interactions

- Required fields (email, password, display name) validated.
- Permissions: each CRUD and event_visibility set; save persists.
- Submit: loading state; success redirect; no double submit. Double-click submit: only one admin created. Browser back after submit: no duplicate create.
- Cancel → admins list.
- Duplicate email: error message; form retained.

## Edge / error states

- API error: message; form retained.
- Duplicate email: error message.
- Display name duplicate (if unique): error message.
- Permission denied: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Create admin with unique email and permissions; assert in list and login to management-web works.
