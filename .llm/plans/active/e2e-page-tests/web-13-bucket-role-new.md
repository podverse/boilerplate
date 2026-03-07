# E2E: Web – Bucket role create – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings/roles/new`.
- **Objective:** Verify create-role form (name, permission options), save and cancel, permission (only users who can create roles can access), invalid bucket 404; new role appears in bucket roles list.

## Selector strategy

- Role name: `getByLabel(/name|role name/i)`.
- Permission controls: checkboxes or toggles for permissions (e.g. read/write bucket, read/write messages).
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to bucket settings or roles list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: role name and permission options; bucket context visible.
- Save and cancel; heading indicates new role.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with create role permission | Load roles/new | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to login. |
| Invalid bucket id | Load /bucket/invalid/settings/roles/new | notFound (404). |
| Child bucket id used for roles route | Load roles/new for child bucket | Redirect to parent bucket roles/settings route; child bucket does not manage roles independently. |
| No permission | Load | 403 or redirect. |

### Values / display

- Bucket name or breadcrumb matches current bucket.
- After success: redirect to roles list or settings; new role appears with correct name and permissions.

### Interaction

- Required name: empty → validation; no submit.
- Validation: role name over max length (SHORT_TEXT_MAX_LENGTH): error or submit disabled.
- Permissions: select options; save persists; list shows new role.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading).
- Cancel/back → settings or roles list without creating.
- Successful create returns to the roles list in bucket settings and the new custom role is visible alongside predefined read-only roles.
- Double-click save: only one create.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid name and permissions → role created; visible in bucket roles list.
- **Validation:** Invalid or duplicate name (if enforced) → error; no create.

## Edge / error states

- API error: error message; form retained.
- Invalid bucket: 404.
- Duplicate role name (if enforced): error.

## Test data mapping

- **Bucket:** Seeded E2E Bucket One; use id from seed.
- **New role name:** Unique (e.g. "E2E Role " + timestamp); assert in roles list after create.
- **Invalid bucketId:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "bucket-role-new-form".
- After create: "bucket-role-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket role new spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-role-new.spec.ts` or settings spec.
- Page: `apps/web/src/app/(main)/bucket/[id]/settings/roles/new/page.tsx`.
- Test: auth redirect; valid create; validation; cancel; role appears in list.
