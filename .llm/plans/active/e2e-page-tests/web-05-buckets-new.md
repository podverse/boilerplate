# E2E: Web – Create bucket

## Route

(main)/buckets/new.

## Layout conditions to test

- Form visible with fields for bucket name and any other required inputs (e.g. public/private).
- Submit button (e.g. "Create" / "Save") and cancel or back link visible.
- Page title or heading indicates create bucket.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user:** Form loads; submit allowed.
- **Unauthenticated user:** Redirect to login; form not visible.

## Values / display conditions

- Default values (e.g. isPublic) match app defaults.
- After successful create: redirect to bucket list or new bucket detail; new bucket appears in list or detail with submitted name and options.

## CRUD

- **Create:** Submit valid name (and options) → bucket created; redirect and new bucket visible.
- **Create with validation errors:** Invalid or empty required field → validation message; no submit; no duplicate create.

## Functionality / interactions

- Required field validation: empty name (if required) shows error and blocks submit.
- Optional fields: toggles or inputs reflect choice and persist on create.
- Cancel/back link returns to buckets list without creating.
- Submit button shows loading state during request; disabled or spinner to prevent double submit.
- Double-click or rapid double submit: only one bucket created; no duplicate record.
- Browser back after successful submit: no duplicate create (e.g. redirect or confirm form).
- Success: redirect to expected route; new bucket has correct name and visibility.

## Edge / error states

- Duplicate name or uniqueness violation: error message shown; form remains editable.
- API error (4xx/5xx): error message displayed; form data retained where appropriate.
- Session lost during submit: appropriate redirect or error; no orphan bucket with wrong owner.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Create a new bucket with a known name; assert it appears in list/detail and ownership is current user.
