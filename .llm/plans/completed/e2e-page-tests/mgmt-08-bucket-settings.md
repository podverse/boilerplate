# E2E: Management-web – Bucket settings – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/settings`.
- **Objective:** Verify settings form (bucket name, isPublic, etc.), admins and roles sections/links, save persistence, permission-based editability; 404 for invalid bucket.

## Selector strategy

- Heading: bucket settings; breadcrumb with bucket name.
- Form: bucket name, isPublic, other options.
- Admins: list or link to admins; roles: list or link to roles.
- Save: `getByRole('button', { name: /save|update/i })`.
- Back/cancel: link to bucket detail.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Initial load: optionally assert loading or placeholder until settings load; then content replaces it (no permanent loading).
- Page title/heading bucket settings; breadcrumb.
- Settings form (name, isPublic, etc.); admins and roles sections or links.
- Save and back; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with buckets update | Load settings | Form editable; save allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id | Load | notFound (404). |
| Child bucket id | Load settings for child bucket | Redirect to the top-level parent bucket settings route; child buckets do not have an independent settings surface. |
| No permission | Load | 403 or read-only. |

### Values / display

- Bucket name and options match current bucket.
- Admins list: current bucket admins; roles list: current roles.
- After save: next load shows updated data.

### Interaction

- Save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); success; only one update on double-click.
- Validation: invalid values show error; no save.
- Admins link → bucket settings admins; edit admin → /bucket/[id]/settings/admins/[userId]/edit.
- Roles link → roles list; new role → /bucket/[id]/settings/roles/new.
- Cancel/back → bucket detail.
- Accessibility: primary actions (save, cancel, admin/role links) focusable; tab order reasonable.

## CRUD

- **Read:** Displayed settings, admins, roles match API.
- **Update:** Change settings and save; persistence.
- **Admin/role management:** Add/edit (covered in admin-edit and role plans).

## Edge / error states

- API error on save: error; form retained.
- Permission denied: 403 or redirect.
- Invalid bucket: notFound.

## Test data mapping

- **Seeded bucket:** E2E bucket id; assert owner and settings.
- **Update:** Change one setting; assert persistence.
- **Read-only:** Admin without bucketsCrud update → read-only or 403.

## Screenshot and trace checkpoints

- Settings loaded: "mgmt-bucket-settings-form".
- After save: "mgmt-bucket-settings-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket settings spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-settings.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/settings/page.tsx`.
- Test: auth redirect; owner/admin can edit and save; invalid id 404.
