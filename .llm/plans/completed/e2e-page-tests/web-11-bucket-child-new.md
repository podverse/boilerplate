# E2E: Web – Create child bucket – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/new` — create child bucket under parent [id].
- **Objective:** Verify create-child-bucket form, parent context visible, validation, success redirect to parent or new bucket, cancel, and double-submit protection; unauthenticated and permission-based redirect.

## Selector strategy

- Heading: "New bucket" or "Add bucket"; parent bucket name or breadcrumb.
- Bucket name: `getByLabel(/name|bucket name/i)`.
- isPublic / options: checkbox or toggle if present.
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to parent bucket detail.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: bucket name and any options (e.g. isPublic); parent context (name or breadcrumb) visible.
- Submit and cancel visible; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with create permission | Load /bucket/[parentId]/new | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to login. |
| Invalid parent bucket id | Load /bucket/invalid/new | notFound (404). |
| No permission (e.g. read-only) | Load | 403 or redirect; form not visible. |

### Values / display

- Parent bucket name or breadcrumb matches current parent.
- After success: redirect to parent bucket detail or new child detail; new child visible in parent's bucket list.

### Interaction

- Required field: empty name → validation; no submit.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); one create on double-click; redirect to parent or child detail.
- Cancel/back → parent bucket detail without creating.
- Browser back after success: no duplicate create.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid name (and options) → child bucket created under parent; visible in parent UI.
- **Validation:** Invalid or empty name → error; no create.

## Edge / error states

- API error: error message; form retained.
- Session lost: redirect or error; no orphan child.
- Duplicate name (if enforced): error message.

## Test data mapping

- **Parent:** Seeded E2E Bucket One (or Two); use its id from seed.
- **New child name:** Unique; assert child appears under parent after create.
- **Invalid parentId:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form with parent context: "bucket-child-new-form".
- After create: "bucket-child-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket child new spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-new.spec.ts` or bucket spec.
- Page: `apps/web/src/app/(main)/bucket/[id]/new/page.tsx`.
- Test: unauthenticated redirect; valid create; validation; cancel; double-submit.
