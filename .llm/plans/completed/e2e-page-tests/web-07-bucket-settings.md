# E2E: Web – Bucket settings – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings`.
- **Objective:** Verify settings form (e.g. message body max length), admins list/link, save persistence, permission-based editability (owner/bucket admin vs read-only), and invalid id 404.

## Selector strategy

- Heading: "Bucket settings" or equivalent; breadcrumb with bucket name.
- Settings form: inputs for bucket-level options (e.g. message body max length).
- Admins: list or link "Admins" / "Manage admins"; add/edit admin links.
- Save: `getByRole('button', { name: /save|update/i })`.
- Back/cancel: link to bucket detail.
- Validation/error: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Initial load: optionally assert loading indicator or placeholder until settings load; then assert content replaces it (no permanent loading).
- Page title/heading indicates bucket settings.
- Settings form or sections visible (e.g. message body max length).
- Link/section to manage admins (list or link to add/edit).
- Back/cancel or link to bucket detail; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated, owner or bucket admin (update) | Load settings | Edits allowed; save works. |
| Unauthenticated | Load settings | Redirect to login. |
| Invalid bucket id | Load /bucket/invalid/settings | notFound (404). |
| Authenticated, no permission (read-only) | Load settings | 403 or read-only; settings not editable. |

### Values / display

- Bucket name or breadcrumb matches current bucket.
- Current settings values match stored (e.g. message body max length); empty when null.
- Admins list: current bucket admins and owner; "owner" label correct.
- Roles tab/section is visible and distinguishes predefined roles from custom roles; predefined roles are read-only and custom roles expose edit/delete actions.

### Interaction

- Save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); only one update on double-click.
- Validation: invalid values (e.g. negative max length) show error; no save.
- Accessibility: primary actions (save, cancel, admin links) focusable; tab order reasonable.
- Admins link → bucket settings admins or invite; edit admin → /bucket/[id]/settings/admins/[userId]/edit.
- Roles link/tab → roles list in settings; create role → /bucket/[id]/settings/roles/new; successful role create/edit returns to the roles list.
- Cancel/back → bucket detail without saving.
- Browser back after save: no duplicate submit.

## CRUD

- **Read:** Displayed settings and admins match API.
- **Update:** Change settings and save; next load shows updated data.
- **Admin management:** Add/edit/remove admins; permission changes persist (covered in admin-edit plan).

## Edge / error states

- API error on save: error message; form retained.
- Permission denied: clear message or redirect; no 500.
- Invalid bucket id: notFound.

## Test data mapping

- **Seeded bucket:** E2E Bucket One; assert owner and default settings.
- **Update:** Change one setting (e.g. max length); assert persistence.
- **Read-only user:** User with bucket_read only (if seed supports) → read-only or 403.

## Screenshot and trace checkpoints

- Settings loaded: "bucket-settings-form".
- Admins section: "bucket-settings-admins-list".
- After save: "bucket-settings-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket settings spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-settings.spec.ts`.
- Page: `apps/web/src/app/(main)/bucket/[id]/settings/page.tsx`.
- Test: unauthenticated redirect; owner can edit and save; invalid id 404; optional read-only branch.
