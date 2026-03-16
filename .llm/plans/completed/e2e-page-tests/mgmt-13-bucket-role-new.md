# E2E: Management-web – Bucket role create – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings/roles/new`.
- **Objective:** Verify create-role form (name, permissions), save and cancel, permission-based access; new role appears in bucket roles list; 404 for invalid bucket.

## Selector strategy

- Role name: `getByLabel(/name|role name/i)`.
- Permission controls: checkboxes or toggles.
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to roles list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: role name and permission options; bucket context; save and cancel; main nav.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with permission to create roles | Load roles/new | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id | Load | notFound (404). |
| Child bucket id | Load roles/new for child bucket | Redirect to the top-level parent bucket roles route; child buckets do not manage roles independently. |
| No permission | Load | 403 or redirect. |

### Values / display

- Bucket context correct; after success new role in roles list with correct name and permissions.

### Interaction

- Required name: empty → validation; no submit.
- Validation: role name over max length (SHORT_TEXT_MAX_LENGTH): error or submit disabled.
- Permissions: select options; save persists; list shows new role.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading).
- Cancel → roles list without creating.
- Double-click save: only one create.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid name and permissions → role created; visible in bucket roles list.
- **Validation:** Invalid or duplicate name (if enforced) → error; no create.

## Edge / error states

- API error: error; form retained.
- Invalid bucket: 404.
- Duplicate role name (if enforced): error.

## Test data mapping

- **Bucket:** Seeded E2E bucket id.
- **New role name:** Unique; assert in roles list after create.
- **Invalid bucketId:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "mgmt-bucket-role-new-form".
- Success: "mgmt-bucket-role-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket role new spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-role-new.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`.
