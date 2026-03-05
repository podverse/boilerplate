# E2E: Web – Short URL bucket (public)

## Route

(main)/b/[id] — id is bucket short_id (public bucket view).

## Layout conditions to test

- Bucket name or title visible.
- Public bucket content: e.g. messages list or placeholder when public; or read-only view.
- Link to send message (e.g. "Send message") when allowed.
- No main app nav (or minimal) for anonymous public view; or nav when logged in.
- No infinite redirect.

## Auth / redirect conditions

- **Valid public bucket short_id:** Page loads; content visible (messages or empty state).
- **Valid private bucket short_id:** Redirect to login or 403/404; private content not exposed.
- **Invalid or non-existent short_id:** notFound (404).
- **Authenticated user on public bucket:** Same content; possibly additional actions (e.g. send message) or nav.

## Values / display conditions

- Bucket name matches seed for that short_id.
- Public messages (isPublic true) visible; non-public messages hidden from anonymous.
- Dates and sender names formatted correctly.
- Empty state when no public messages.

## CRUD

- **Read:** Only public data visible; no write without auth (or write via send-message page).

## Functionality / interactions

- Send message link → /b/[id]/send-message (or login then send).
- No write/edit/delete for anonymous on public view (or clear CTA to log in).
- Links do not expose internal UUIDs unnecessarily.

## Edge / error states

- Invalid short_id: notFound; no 500. Invalid short_id format (wrong length, invalid chars): 404 or validation error; no 500.
- Private bucket: notFound or redirect to login; no content leak.
- Deleted bucket: notFound.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded public bucket short_id (e2ebucket00001); assert name and public message visibility; use private bucket short_id and assert no content or redirect.
