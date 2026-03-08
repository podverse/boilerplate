# E2E: Management-web – User edit – Detailed Plan

## Route and objective

- **Route:** `(main)/user/[id]/edit`.
- **Objective:** Verify edit-user form pre-fill (email, display name; password change if present), update persistence, validation, cancel and double-submit; 404 for invalid id; permission (usersCrud update).

## Selector strategy

- Email: `getByLabel(/email/i)` (may be read-only).
- Display name: `getByLabel(/display name|name/i)`.
- Password (change): current, new, confirm if present.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to user detail or users list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form pre-filled with email, display name; optional password change section; save and cancel; main nav.
- Breadcrumbs: present (e.g. Users > User name > Edit); links navigate to list or detail.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with users update | Load /user/[id]/edit | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid user id | Load /user/invalid/edit | notFound (404). |
| No permission | Load | Redirect back to `/users`; edit form not shown. |

### Values / display

- Pre-fill: email, display name match current user (main DB).
- After save: user detail and list show updated data.
- No password pre-filled; password change optional.

### Interaction

- Change display name; save: assert primary button disabled or shows loading during request; re-enables after success or error; success; detail/list reflect update.
- `?tab=password` activates the password tab; unknown tab values fall back to profile.
- Password change (if present): current required; new and confirm validated; confirm password different from new password: validation error shown, submit blocked; save persists; user can log in with new password (main app).
- Cancel → user detail or users list without saving.
- Double-click save: only one update.
- Validation: required fields; duplicate email (if editable) → error.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API (main app user).
- **Update:** Change display name (and optional password); save persists; no duplicate user.

## Edge / error states

- API error: error; form retained.
- User deleted elsewhere: 404 or conflict on save.
- Invalid user id: notFound.
- Duplicate email (if email editable): error.

## Test data mapping

- **User:** Main DB user id from seed (e.g. e2e user).
- **Edit:** Change display name; assert detail and list show update.
- **Password change:** New password meeting policy; assert main app login with new password (if applicable).
- **Invalid id:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "mgmt-user-edit-form".
- After save: "mgmt-user-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; user edit spec.

## Implementation notes

- Spec: `apps/management-web/e2e/user-edit.spec.ts`.
- Page: `apps/management-web/src/app/(main)/user/[id]/edit/page.tsx`.
- Test: auth redirect; pre-fill and update; invalid id 404; permission denied.
