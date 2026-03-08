# E2E: Management-web – Create bucket – Detailed Plan

## Route and objective

- **Route:** `(main)/buckets/new`.
- **Objective:** Verify create-bucket form (name, owner/parent, isPublic as applicable), validation, save and redirect, cancel, double-submit protection; permission (bucketsCrud create); unauthenticated redirect.

## Selector strategy

- Bucket name: `getByLabel(/name|bucket name/i)`.
- Owner/parent or options: per app (main DB bucket creation may have different fields).
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to buckets list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: bucket name and any required options; heading indicates create bucket.
- Breadcrumbs: present (e.g. Buckets > New bucket); links navigate correctly.
- Submit and cancel; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with buckets create | Load /buckets/new | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to /login. |
| No create permission | Load | Redirect back to `/buckets`; create form not shown. |

### Values / display

- After success: redirect to buckets list or bucket detail; new bucket in list with correct name/owner.

### Interaction

- Required name: empty → validation; no submit.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one create on double-click; redirect; new bucket visible.
- Cancel → buckets list without creating.
- Browser back after success: no duplicate create.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid data → bucket created; visible in list.
- **Validation:** Invalid or empty required → error; no create.

## Edge / error states

- API error: error message; form retained.
- Duplicate name (if enforced): error.
- Session lost: redirect or error.

## Test data mapping

- **New bucket name:** Unique; assert in list after create.
- **Permission:** Only when bucketsCrud create (or super admin).
- **Invalid:** No create permission → 403.

## Screenshot and trace checkpoints

- Form: "mgmt-buckets-new-form".
- Success: "mgmt-buckets-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; buckets new spec.

## Implementation notes

- Spec: `apps/management-web/e2e/buckets-new.spec.ts`.
- Page: `apps/management-web/src/app/(main)/buckets/new/page.tsx`.
- Test: auth redirect; valid create; validation; cancel; permission denied.
