# E2E: Management-web – Create admin – Detailed Plan

## Route and objective

- **Route:** `(main)/admins/new`.
- **Objective:** Verify create-admin form (username, password, display name, permissions), validation, save and redirect, cancel, double-submit protection; permission (adminsCrud create); unauthenticated redirect.

## Selector strategy

- Username: `getByLabel(/username/i)` (management uses username).
- Password: `getByLabel(/password/i)`.
- Display name: `getByLabel(/display name|name/i)` if present.
- Permissions: checkboxes or toggles (adminsCrud, usersCrud, bucketsCrud, bucketMessagesCrud, event_visibility, etc.).
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to admins list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: username, password, optional display name, permissions section; heading create admin; submit and cancel; main nav.
- Breadcrumbs: present (e.g. Admins > New admin); links navigate correctly.
- Role dropdown (if present): populated from API before submit is enabled; wait for role options when testing submit.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with admins create | Load /admins/new | Form loads; submit allowed; permissions section visible. |
| Unauthenticated | Load | Redirect to /login. |
| No create permission | Load | Redirect back to `/admins`; create form not shown. |

### Values / display

- Permissions: role selection or permission summary matches the current admin form model; defaults reflect the app's new-admin state.
- New admin form: default permission state when no initial values (e.g. admins/users all on, buckets/messages all off).
- After success: redirect to admins list or admin detail; new admin in list with correct username and permissions.
- Validation: username required, password policy, duplicate username → error.

### Interaction

- Required: username, password; empty submit shows validation or API error.
- Permissions/role selection: choose the role or permission model exposed by the form; if "Create role" is available, it should navigate to `/admins/roles/new` and return to the admin form afterward.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one create on double-click; redirect; new admin visible.
- Cancel → admins list without creating.
- Browser back after success: no duplicate create.
- No password echoed in DOM or URL.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid username, password (and display name, permissions) → admin created; visible in admins list; can log in to management.
- **Validation:** Invalid or duplicate username → error; no create.

## Edge / error states

- API error: error; form retained.
- Duplicate username: error message.
- Session lost: redirect or error.
- Password too weak: validation error.

## Test data mapping

- **New admin:** Unique username (e.g. e2e-admin2) and valid password; assert in list and login works.
- **Duplicate:** Use e2e-superadmin (existing) → duplicate error.
- **Permission:** Only when adminsCrud create (super admin).

## Screenshot and trace checkpoints

- Form: "mgmt-admins-new-form".
- Success: "mgmt-admins-new-success".
- Validation: "mgmt-admins-new-validation".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; admins new spec.

## Implementation notes

- Spec: `apps/management-web/e2e/admins-new.spec.ts`.
- Page: `apps/management-web/src/app/(main)/admins/new/page.tsx`.
- Management auth uses username; form fields and API use username.
- Test: auth redirect; valid create with permissions; validation; cancel; duplicate username; permission denied.
