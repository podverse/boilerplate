# E2E: Management-web – Bucket role edit – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings/roles/[roleId]/edit`.
- **Objective:** Verify edit-role form pre-fill, update name and permissions, save and cancel; permission-based access; 404 for invalid bucket or roleId.

## Selector strategy

- Role name: `getByLabel(/name|role name/i)`.
- Permission controls: checkboxes/toggles; pre-filled.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to roles list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form pre-filled with role name and permissions; bucket context; save and cancel; main nav.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with update permission | Load edit | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id or roleId | Load | notFound (404). |
| Child bucket id | Load edit for child bucket role route | Redirect to the top-level parent bucket roles route. |
| Predefined role id | Load predefined role edit route | notFound or equivalent non-editable outcome; only custom roles are editable. |
| No permission | Load | 403 or redirect. |

### Values / display

- Pre-fill matches current role; after save roles list shows updated name/permissions.

### Interaction

- Change name or permissions; save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error; success; list reflects change.
- Cancel → roles list without saving.
- Double-click save: only one update.
- Validation: required name; role name over max length (SHORT_TEXT_MAX_LENGTH): error or submit disabled; invalid permission combo (if validated) → error.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Change and save; list and re-load show updated data.

## Edge / error states

- API error: error; form retained.
- Role deleted elsewhere: 404 or conflict on save.
- Invalid roleId: notFound.

## Test data mapping

- **Bucket and role:** Seeded bucket with at least one role (or create in test).
- **Edit:** Change name or one permission; assert list and re-load show update.
- **Invalid roleId:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "mgmt-bucket-role-edit-form".
- After save: "mgmt-bucket-role-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket role edit spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-role-edit.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`.
