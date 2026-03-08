# E2E: Web – Bucket admin edit – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings/admins/[userId]/edit`.
- **Objective:** Verify edit admin form (role select, optional expiry), save and cancel, permission (only bucket admins with update can access), invalid ids 404.

## Selector strategy

- Role select: `getByLabel(/role/i)` or `getByRole('combobox', { name: /role/i })`.
- Optional fields: expiry, notes (if present).
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to bucket settings or admins list.
- Error: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form may not render until roles are loaded from API; assert role dropdown populated before relying on save button.
- Form: role dropdown (everything, bucket_full, read_everything, bucket_read or app equivalents), optional expiry.
- Save and cancel visible; heading indicates edit admin.
- Bucket context (breadcrumb or bucket name) visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated, bucket admin with update | Load edit | Form loads; save allowed. |
| Unauthenticated | Load edit | Redirect to login. |
| Invalid bucket id or userId | Load with invalid ids | notFound (404). |
| No permission | Load edit | 403 or redirect. |

### Values / display

- Form pre-filled: selected role and optional expiry match current bucket admin record.
- Role options from API (predefined + custom); labels/descriptions correct (e.g. Everything, Bucket full, Read everything, Bucket read).

### Interaction

- Change role and save: assert submit button disabled or shows loading during request; assert it re-enables after success or error; bucket admins list shows updated role.
- Cancel/back → bucket settings or admins without saving.
- Double-click save: only one update.
- Validation: required role selected; invalid expiry (if present) shows error.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API for this bucket admin.
- **Update:** Change role (and optional expiry); save persists; list reflects change.

## Edge / error states

- API error on save: error message; form retained.
- User no longer admin: 404 or conflict on save.
- Invalid userId: notFound.

## Test data mapping

- **Seeded bucket:** E2E Bucket One with at least one admin (or add in test).
- **Edit:** Change role from e.g. bucket_read to bucket_full; assert list and re-load form show new role.
- **Invalid userId:** Non-existent or not in bucket → 404.

## Screenshot and trace checkpoints

- Form loaded: "bucket-admin-edit-form".
- After save: "bucket-admin-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket admin edit spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-admin-edit.spec.ts`.
- Page: `apps/web/src/app/(main)/bucket/[id]/settings/admins/[userId]/edit/page.tsx`.
- Test: unauthenticated redirect; valid edit and save; invalid ids 404; permission denied.
