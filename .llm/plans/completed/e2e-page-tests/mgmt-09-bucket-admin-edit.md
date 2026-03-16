# E2E: Management-web – Bucket admin edit – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings/admins/[userId]/edit`.
- **Objective:** Verify edit bucket-admin form (role select, etc.), save and cancel, permission-based access; 404 for invalid bucket or userId.

## Selector strategy

- Role select: `getByLabel(/role/i)` or combobox.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to bucket settings or admins list.
- Error: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: role dropdown (and any other fields); bucket context visible.
- Save and cancel; heading edit admin.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with permission | Load edit | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id or userId | Load with invalid ids | notFound (404). |
| Target admin is bucket owner | Load owner edit route | Redirect back to the bucket admins/settings list; owner permissions are not editable. |
| No permission | Load | 403 or redirect. |

### Values / display

- Form pre-filled: role and options match current bucket admin.
- After save: admins list shows updated role.

### Interaction

- Change role and save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error; success; list reflects change.
- Cancel/back → bucket settings or admins without saving.
- Double-click save: only one update.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Change role; save persists; list reflects.

## Edge / error states

- API error: error; form retained.
- User no longer admin: 404 or conflict on save.
- Invalid userId: notFound.

## Test data mapping

- **Bucket and admin:** Seeded bucket with at least one admin (or add in test).
- **Edit:** Change role; assert list and re-load show new role.
- **Invalid ids:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "mgmt-bucket-admin-edit-form".
- After save: "mgmt-bucket-admin-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket admin edit spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-admin-edit.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/settings/admins/[userId]/edit/page.tsx`.
