# E2E: Management-web – Admin edit – Detailed Plan

## Route and objective

- **Route:** `(main)/admin/[id]/edit`.
- **Objective:** Verify edit-admin form (username, display name, password change, permissions), save and cancel; super admin editing self (can edit profile; permissions section hidden for target super admin); non–super admin editing: permissions section visible when current user has adminsCrud update; 404 for invalid id.

## Selector strategy

- Username: `getByLabel(/username/i)`.
- Display name: `getByLabel(/display name|name/i)`.
- Password (change): current, new, confirm if present.
- Permissions: checkboxes/toggles (adminsCrud, usersCrud, bucketsCrud, bucketMessagesCrud, event_visibility); hidden when target admin is super admin.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to admin detail or admins list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: username, display name, optional password change, permissions section (when visible).
- Breadcrumbs: present (e.g. Admins > Admin name > Edit); links navigate to list or detail.
- Permissions section hidden when editing super admin (targetIsSuperAdmin); visible when editing non–super admin and current user has admins create/update.
- Save and cancel; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with admins update | Load /admin/[id]/edit | Form loads; save allowed. |
| Super admin editing self | Load own admin edit | Form loads; permissions section hidden (cannot change super admin permissions). |
| Unauthenticated | Load | Redirect to /login. |
| Invalid admin id | Load /admin/invalid/edit | notFound (404). |
| No permission | Load | Redirect back to `/admins`; edit form not shown. |
| canAccessEdit | adminsCrud update OR (target is super admin AND current user is that admin) | Edit page accessible; permissions editable only when target not super admin and user has update. |

### Values / display

- Pre-fill: username, display name, permissions (when visible) match current admin.
- After save: admin detail and list show updated data.
- Super admin target: permissions section not rendered; only profile fields editable.

### Interaction

- Change username, display name, or permissions (when visible); save: assert primary button disabled or shows loading during request; re-enables after success or error; success; detail/list reflect update.
- Password change (if present): current required; new and confirm validated; confirm password different from new password: validation error shown, submit blocked; save persists; admin can log in with new password.
- Role-driven permissions (if present) should return the selected role/permission summary on save; creating a new role should round-trip back to this form.
- Cancel → admin detail or admins list without saving.
- Double-click save: only one update.
- Validation: required username; duplicate username (if changed) → error; permissions validation per app.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Change username, display name, permissions (when allowed), or password; save persists; no duplicate admin.

## Edge / error states

- API error: error; form retained.
- Admin deleted elsewhere: 404 or conflict on save.
- Invalid admin id: notFound.
- Editing super admin: permissions section hidden; profile updates only.
- Duplicate username: error.

## Test data mapping

- **Admin:** Seeded super admin id or created admin id.
- **Edit super admin (self):** Change display name only; assert permissions section hidden; save succeeds.
- **Edit non–super admin:** Change permissions (e.g. usersCrud); assert detail shows updated permissions.
- **Invalid id:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form (non–super admin): "mgmt-admin-edit-form-with-permissions".
- Form (super admin self): "mgmt-admin-edit-form-super-admin-no-permissions".
- After save: "mgmt-admin-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; admin edit spec.

## Implementation notes

- Spec: `apps/management-web/e2e/admin-edit.spec.ts`.
- Page: `apps/management-web/src/app/(main)/admin/[id]/edit/page.tsx`.
- AdminForm: canEditPermissions when current user has admins create/update; targetIsSuperAdmin hides permissions section.
- Test: auth redirect; edit non–super admin with permissions change; edit super admin (self) with profile-only change; invalid id 404; permission denied.
