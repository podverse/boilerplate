# E2E: Web – Bucket role edit – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings/roles/[roleId]/edit`.
- **Objective:** Verify edit-role form pre-fill, update name and permissions, save and cancel, permission-based access; 404 for invalid bucket or roleId.

## Selector strategy

- Role name: `getByLabel(/name|role name/i)`.
- Permission controls: checkboxes/toggles; pre-filled to match role.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to roles list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form pre-filled with role name and permissions; bucket context visible.
- Save and cancel; heading indicates edit role.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with update permission | Load edit | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to login. |
| Invalid bucket id or roleId | Load with invalid ids | notFound (404). |
| Predefined role id | Load predefined role edit route | notFound or equivalent non-editable outcome; predefined roles are read-only. |
| Child bucket id used for roles route | Load edit for child bucket role route | Redirect to parent bucket roles/settings route. |
| No permission | Load | 403 or redirect. |

### Values / display

- Pre-fill: name and permissions match current role.
- After save: roles list shows updated name/permissions.
- Custom roles are editable; predefined roles remain visible only as read-only entries in the roles list.

### Interaction

- Change name or permissions; save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error; success; list reflects change.
- Cancel/back → roles list without saving.
- Double-click save: only one update.
- Validation: required name; role name over max length (SHORT_TEXT_MAX_LENGTH): error or submit disabled; invalid permission combo (if validated) → error.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Change and save; list and re-load form show updated data.

## Edge / error states

- API error: error message; form retained.
- Role deleted elsewhere: 404 or conflict on save.
- Invalid roleId: notFound.

## Test data mapping

- **Bucket and role:** Seeded bucket with at least one role (or create in test).
- **Edit:** Change name or one permission; assert list and re-load show update.
- **Invalid roleId:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form pre-filled: "bucket-role-edit-form".
- After save: "bucket-role-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket role edit spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-role-edit.spec.ts`.
- Page: `apps/web/src/app/(main)/bucket/[id]/settings/roles/[roleId]/edit/page.tsx`.
- Test: auth redirect; pre-fill and update; invalid ids 404.
