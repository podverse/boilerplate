# E2E: Web – Create nested bucket (bucket under bucket) – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/bucket/new` — create a "bucket" (nested resource) under parent bucket [id].
- **Objective:** Verify form for creating nested bucket, parent context, validation, success redirect, cancel, and permission; 404 for invalid parent.

## Selector strategy

- Heading: create nested bucket title; parent bucket context (breadcrumb or name).
- Form fields: name and any options per app (e.g. type or visibility).
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: link to parent bucket detail or settings.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form visible with required fields; parent bucket context visible.
- Submit and cancel; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with permission | Load /bucket/[id]/bucket/new | Form loads; submit allowed. |
| Unauthenticated | Load | Redirect to login. |
| Invalid parent id | Load | notFound (404). |
| No permission | Load | 403 or redirect. |

### Values / display

- Parent context correct; after success new nested bucket visible in parent's list or detail.

### Interaction

- Validation: required fields; submit only when valid.
- Save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); single create on double-click; redirect correct.
- Cancel → parent without creating.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable.

## CRUD

- **Create:** Valid data → nested bucket created; visible in parent context.
- **Validation:** Invalid data → error; no create.

## Edge / error states

- API error: message; form retained.
- Invalid parent: 404.

## Test data mapping

- **Parent bucket:** Seeded bucket id from E2E seed.
- **New nested bucket:** Unique name; assert visibility under parent.

## Screenshot and trace checkpoints

- Form: "bucket-nested-new-form".
- Success: "bucket-nested-new-success".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; nested bucket new spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-nested-new.spec.ts` or bucket spec.
- Page: `apps/web/src/app/(main)/bucket/[id]/bucket/new/page.tsx`.
- Test: auth redirect; valid create; validation; cancel.
