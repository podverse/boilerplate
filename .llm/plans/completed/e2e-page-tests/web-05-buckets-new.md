# E2E: Web – Create bucket – Detailed Plan

## Route and objective

- **Route:** `(main)/buckets/new`.
- **Objective:** Verify create-bucket form validation, successful create with redirect, cancel behavior, and double-submit protection; unauthenticated redirect.

## Selector strategy

- Bucket name: `getByRole('textbox', { name: /name/i })` or `getByLabel(/bucket name|name/i)`.
- Public/private: `getByRole('checkbox', { name: /public/i })` or toggle/radio.
- Submit: `getByRole('button', { name: /create|save/i })`.
- Cancel/back: `getByRole('link', { name: /cancel|back/i })` or navigation.
- Validation error: `getByRole('alert')` or inline error text.

## Assertion matrix

### Layout

- Form: bucket name and any required inputs (e.g. isPublic).
- Submit and cancel/back visible.
- Page title/heading indicates create bucket; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Load /buckets/new | Form loads; submit allowed. |
| Unauthenticated | Load /buckets/new | Redirect to login; form not visible. |

### Values / display

- Defaults (e.g. isPublic false/true) match app.
- After success: redirect to bucket list or new bucket detail; new bucket has submitted name and options.

### Interaction

- Required field: empty name shows validation and blocks submit (or API error).
- Optional fields: toggles reflect choice and persist on create.
- Cancel/back → /buckets without creating.
- Submit: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); double-click → only one bucket created.
- Browser back after success: no duplicate create (POST idempotency or redirect).
- Success: redirect to list or detail; new bucket visible with correct name and visibility.
- Accessibility: primary actions (submit, cancel) focusable; tab order reasonable; optional: Enter submits form, Escape cancels.

## CRUD

- **Create:** Valid name (and options) → bucket created; redirect; new bucket in list/detail.
- **Validation:** Invalid or empty required field → validation message; no submit; no duplicate.

## Edge / error states

- Duplicate name or uniqueness violation: error message; form remains.
- API 4xx/5xx: error message; form data retained where appropriate.
- Session lost during submit: redirect or error; no orphan bucket.

## Test data mapping

- **New bucket name:** Unique (e.g. "E2E New Bucket " + timestamp) to avoid duplicate.
- **Seeded user:** e2e@example.com; assert ownership of created bucket.
- **Duplicate:** Create bucket with same name as existing (if uniqueness enforced) → error.

## Screenshot and trace checkpoints

- Form loaded: "buckets-new-form-loaded".
- Validation error: "buckets-new-validation-name".
- Success: "buckets-new-success-redirect".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; create-bucket spec after seed.

## Implementation notes

- Spec: `apps/web/e2e/buckets-new.spec.ts` or buckets spec.
- Page: `apps/web/src/app/(main)/buckets/new/page.tsx`.
- Test: unauthenticated redirect; valid create; validation; cancel; double-submit.
