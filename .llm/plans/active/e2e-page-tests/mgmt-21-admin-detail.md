# E2E: Management-web – Admin detail

## Route

(main)/admin/[id].

## Layout conditions to test

- Admin email and display name as heading or summary.
- Detail: super admin flag, permissions summary (admins, users, buckets, messages, event_visibility).
- Link to edit admin; main nav visible.

## Auth / redirect conditions

- **Authenticated admin with admins read:** Page loads; content matches admin.
- **Unauthenticated:** Redirect to login.
- **Invalid admin id:** notFound (404).
- **No permission:** 403 or redirect.
- **Event visibility:** May restrict viewing other admins for non–super admins.

## Values / display conditions

- Email and display name match management_user and credentials/bio.
- Permissions (CRUD bits, event_visibility) displayed correctly.
- Super admin: is_super_admin true; full access implied.
- Edit link visible when update permission.

## CRUD

- **Read:** Data from management API.
- **Update:** Edit link → (main)/admin/[id]/edit.
- **Delete (if present):** Confirmation dialog; cancel leaves admin; confirm deletes and admin removed from list; cannot delete last super admin.

## Functionality / interactions

- Edit → admin edit page; save persists; detail reflects after reload.
- Back to list → admins list.
- No password or token exposure.

## Edge / error states

- 404 for invalid id: notFound.
- API error: message.
- No permission: 403.
- Deleting own admin (when restricted): blocked or confirmation.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded super admin id; assert email, display name, permissions; test edit link.
