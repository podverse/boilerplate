# E2E: Management-web – Create user – Detailed Plan

## Route and objective

- **Route:** `(main)/users/new`.
- **Objective:** Verify create-user form (email, password, display name as applicable), validation, save and redirect, cancel, double-submit protection; permission (usersCrud create); unauthenticated redirect.

## Selector strategy

- Email: `getByLabel(/email/i)`.
- Password: `getByLabel(/password/i)` (first).
- Display name: `getByLabel(/display name|name/i)` if present.
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to users list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: email, password, optional display name; heading create user; submit and cancel; main nav.
- Breadcrumbs: present (e.g. Users > New user); links navigate correctly.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with users create | Load /users/new | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to /login. |
| No create permission | Load | Redirect back to `/users`; create form not shown. |

### Values / display

- After success: redirect to users list or user detail; new user in list with correct email/name.
- Validation: email format, password policy, required fields.
- User creation supports the app's identifier rules; when the app allows alternate identifier-only flows or returns a set-password link, assert the success state matches that branch rather than assuming an immediate redirect.

### Interaction

- Required fields: email, password; empty submit shows validation or API error.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one create on double-click; redirect; new user visible.
- Cancel → users list without creating.
- Browser back after success: no duplicate create.
- Password policy: length/complexity; error messages clear.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid email, password (and display name) → user created in main DB; visible in users list.
- **Validation:** Invalid or duplicate email → error; no create.

## Edge / error states

- API error: error; form retained.
- Duplicate email: error message.
- Session lost: redirect or error.
- Password too weak: validation error.

## Test data mapping

- **New user:** Unique email (e.g. newuser@example.com) and valid password; assert in users list.
- **Duplicate:** Use e2e@example.com (existing) → duplicate error.
- **Permission:** Only when usersCrud create (or super admin).

## Screenshot and trace checkpoints

- Form: "mgmt-users-new-form".
- Success: "mgmt-users-new-success".
- Validation: "mgmt-users-new-validation".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; users new spec.

## Implementation notes

- Spec: `apps/management-web/e2e/users-new.spec.ts`.
- Page: `apps/management-web/src/app/(main)/users/new/page.tsx`.
- Test: auth redirect; valid create; validation; cancel; duplicate email; permission denied.
