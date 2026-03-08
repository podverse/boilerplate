# E2E: Management-web – Admin detail – Detailed Plan

## Route and objective

- **Route:** `(main)/admin/[id]`.
- **Objective:** Verify admin detail (username, display name, super admin flag, permissions summary), edit link when permitted (adminsCrud update or self when super admin); 404 for invalid id; event_visibility may restrict viewing other admins.

## Selector strategy

- Heading: admin username or display name.
- Detail: username, display name, super admin flag, permissions summary (admins, users, buckets, messages, event_visibility).
- Edit: `getByRole('link', { name: /edit/i })`.
- Back to list: link to /admins.
- No password or token in DOM.

## Assertion matrix

### Layout

- Initial load: wait for content or loading to settle.
- Admin username and display name as heading or summary.
- Detail: super admin flag, permissions summary (CRUD bits, event_visibility).
- Edit link when update permission (or when viewing own admin as super admin).
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with admins read | Load /admin/[id] | Page loads; content matches admin. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid admin id | Load /admin/invalid | notFound (404). |
| No permission | Load | Redirect back to `/admins`; detail page not shown. |
| Event visibility | View other admin | Non–super admin may be restricted (own or all_admins). |
| Super admin viewing self | Load own id | Edit link visible (can edit own profile/permissions when super admin). |

### Values / display

- Username and display name match management_user and credentials/bio.
- Permissions (CRUD bits, event_visibility) displayed correctly.
- Super admin: is_super_admin true; full access implied; permissions section may be hidden (cannot change super admin permissions).
- Edit link visible when adminsCrud update or (admin is super admin and current user is that admin).

### Interaction

- Edit link → /admin/[id]/edit; save on edit persists; detail reflects after reload.
- Back to list → /admins.
- Delete (if present): destructive action — confirmation dialog visible with expected wording; Cancel closes dialog without change; Confirm performs action and admin removed from list; cannot delete last super admin.
- Accessibility: primary actions (Edit, Back, delete) focusable; tab order reasonable.

## CRUD

- **Read:** Data from management API.
- **Update:** Edit link → /admin/[id]/edit.
- **Delete (if present):** Confirmation; cannot delete last super admin.

## Edge / error states

- 404 for invalid id: notFound.
- API error: message.
- No permission: 403.
- Deleting own admin (when restricted): blocked or confirmation.

## Test data mapping

- **Seeded super admin:** e2e-superadmin id; assert username, display name, super admin, permissions (or hidden for super admin).
- **Invalid id:** Non-existent admin id → 404.
- **Edit link:** Visible when adminsCrud update or self as super admin.

## Screenshot and trace checkpoints

- Admin detail: "mgmt-admin-detail".
- Super admin detail: "mgmt-admin-detail-super-admin".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; admin detail spec.

## Implementation notes

- Spec: `apps/management-web/e2e/admin-detail.spec.ts`.
- Page: `apps/management-web/src/app/(main)/admin/[id]/page.tsx`.
- Test: auth redirect; valid admin layout; edit link visibility; invalid id 404; optional delete and event_visibility.
