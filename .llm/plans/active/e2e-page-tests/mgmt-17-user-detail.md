# E2E: Management-web – User detail

## Route

(main)/user/[id].

## Layout conditions to test

- User email and display name as heading or summary.
- Detail list (e.g. created, email verified); link to edit user.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with users read:** Page loads; content matches user.
- **Unauthenticated:** Redirect to login.
- **Invalid user id:** notFound (404).
- **No permission:** 403 or redirect.
- **Event visibility:** Detail may be restricted to own user for admins with limited visibility.

## Values / display conditions

- Email and display name match main DB user.
- Created date (and email_verified_at if shown) formatted correctly.
- Edit link present when update permission.

## CRUD

- **Read:** Data from management API (main DB user).
- **Update:** Edit link → (main)/user/[id]/edit.
- **Delete (if present):** Confirmation dialog; cancel leaves user; confirm deletes and user removed from list.

## Functionality / interactions

- Edit → user edit page; save there persists; detail reflects after reload.
- Back to list → users list.
- No exposure of password or sensitive fields.

## Edge / error states

- 404 for invalid id: notFound.
- API error: message.
- No permission: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use main app user id (e.g. from seed); assert email, display name, edit link.
