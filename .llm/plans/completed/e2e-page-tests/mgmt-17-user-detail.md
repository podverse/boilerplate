# E2E: Management-web – User detail – Detailed Plan

## Route and objective

- **Route:** `(main)/user/[id]`.
- **Objective:** Verify user detail (email, display name, created, etc.), edit link when permitted (usersCrud update); 404 for invalid id; event_visibility may restrict viewing other users for non–super admin.

## Selector strategy

- Heading: user email or display name.
- Detail: email, display name, created date, etc.
- Edit: `getByRole('link', { name: /edit/i })`.
- Back to list: link to /users.
- No password or credential exposure.

## Assertion matrix

### Layout

- Initial load: wait for content or loading to settle.
- User email and display name as heading or summary.
- Detail fields (email, display name, created); edit link when permitted.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with users read | Load /user/[id] | Page loads; content matches user. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid user id | Load /user/invalid | notFound (404). |
| No permission | Load | Redirect back to `/users`; detail page not shown. |
| Event visibility | View other user | Non–super admin may be restricted to own or all_admins scope. |

### Values / display

- Email and display name match main DB user (management API returns main app user).
- Created date formatted correctly.
- Edit link visible when usersCrud update (or super admin).
- No password or credential fields in DOM.

### Interaction

- Edit link → /user/[id]/edit; save on edit page persists; detail reflects after reload.
- Back to list → /users.
- No delete (or delete only when permitted and not self).
- Accessibility: primary actions (Edit, Back) focusable; tab order reasonable.

## CRUD

- **Read:** Data from management API (main app user).
- **Update:** Edit link → /user/[id]/edit.

## Edge / error states

- 404 for invalid id: notFound.
- API error: message.
- No permission: 403.
- Viewing user outside event_visibility: 403 or empty.

## Test data mapping

- **Seeded user:** Main DB user id (e.g. e2e user); assert email, display name.
- **Invalid id:** Non-existent main app user id → 404.
- **Permission:** usersCrud read; edit link when usersCrud update.

## Screenshot and trace checkpoints

- User detail: "mgmt-user-detail".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; user detail spec.

## Implementation notes

- Spec: `apps/management-web/e2e/user-detail.spec.ts`.
- Page: `apps/management-web/src/app/(main)/user/[id]/page.tsx`.
- Test: auth redirect; valid user layout and edit link; invalid id 404; optional event_visibility.
