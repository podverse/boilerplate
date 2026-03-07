# E2E: Management-web – Create child bucket – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/new`.
- **Objective:** Verify create-child-bucket form, parent context, validation, success redirect, cancel; permission (bucketsCrud create); 404 for invalid parent.

## Selector strategy

- Heading: new bucket; parent bucket name or breadcrumb.
- Bucket name: `getByLabel(/name|bucket name/i)`.
- Options: isPublic etc. if present.
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to parent bucket detail.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: bucket name and options; parent context visible; submit and cancel; main nav.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with buckets create | Load /bucket/[parentId]/new | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid parent id | Load | notFound (404). |
| No permission | Load | 403 or redirect. |

### Values / display

- Parent context correct; after success new child visible in parent's list or detail.

### Interaction

- Required name: empty → validation; no submit.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one create on double-click; redirect to parent or child detail.
- Cancel → parent bucket Topics tab/detail without creating.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid name and options → child bucket created; visible under parent.
- **Validation:** Invalid or empty name → error; no create.

## Edge / error states

- API error: error; form retained.
- Invalid parent: 404.
- Session lost: redirect or error.

## Test data mapping

- **Parent:** Seeded bucket id from E2E seed.
- **New child name:** Unique; assert child appears under parent after create.
- **Invalid parentId:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "mgmt-bucket-child-new-form".
- Success: "mgmt-bucket-child-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket child new spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-new.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/new/page.tsx`.
