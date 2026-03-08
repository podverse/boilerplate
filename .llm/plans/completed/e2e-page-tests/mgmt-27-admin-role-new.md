# E2E: Management-web – Admin role create – Detailed Plan

## Route and objective

- **Route:** `(main)/admins/roles/new`.
- **Objective:** Verify create-admin-role form (role name, permission set or preset), save and redirect, cancel, double-submit protection; permission (admins create or roles create); unauthenticated redirect; new role available when creating/editing admins.

## Selector strategy

- Role name: `getByLabel(/name|role name/i)`.
- Permission set: checkboxes or toggles (adminsCrud, usersCrud, bucketsCrud, bucketMessagesCrud, event_visibility) or preset selector.
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to admins list or roles list (if exists).
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: role name and permission options (or preset); heading create role; submit and cancel; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with permission to create admin roles | Load /admins/roles/new | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to /login. |
| No permission | Load | 403 or redirect. |

### Values / display

- Permission options match management role schema (CRUD bits, event_visibility).
- After success: redirect to admins list or roles list; new role available in admin create/edit role dropdown (or equivalent).
- Validation: required role name; duplicate name (if enforced) → error.
- If this route is reached from an admin form returnUrl, successful create or cancel returns to that originating admin form and the new role is available for selection.

### Interaction

- Required name: empty → validation; no submit.
- Select permissions; save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one create on double-click; redirect; new role appears where roles are selected (e.g. admin form).
- Cancel → admins or roles list without creating.
- Browser back after success: no duplicate create.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid name and permissions → role created; visible/selectable when creating or editing admins.
- **Validation:** Invalid or duplicate name → error; no create.

## Edge / error states

- API error: error; form retained.
- Duplicate role name (if enforced): error.
- Session lost: redirect or error.

## Test data mapping

- **New role name:** Unique (e.g. "E2E Role " + timestamp); assert role available in admin create/edit form after create.
- **Permission:** Set specific CRUD and event_visibility; assert new admin created with this role has same permissions.
- **Invalid:** No permission → 403.

## Screenshot and trace checkpoints

- Form: "mgmt-admin-role-new-form".
- Success: "mgmt-admin-role-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; admin role new spec.

## Implementation notes

- Spec: `apps/management-web/e2e/admins-roles-new.spec.ts`.
- Page: `apps/management-web/src/app/(main)/admins/roles/new/page.tsx`.
- Test: auth redirect; valid create; validation; cancel; permission denied; assert role usable in admin create flow.
