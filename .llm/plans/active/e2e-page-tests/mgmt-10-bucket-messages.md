# E2E: Management-web – Bucket messages

## Route

(main)/bucket/[id]/messages.

## Layout conditions to test

- Initial load: wait for messages list or empty state (or loading) before asserting.
- Page title; messages table or list (sender, body, date, public, actions).
- Empty state when no messages; link back to bucket.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with read:** Messages load.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket id:** notFound (404).
- **No permission:** 403 or empty/redirect.

## Values / display conditions

- Messages match API; order and pagination correct.
- Bucket context in heading/breadcrumb.
- Empty state message when no messages.

## CRUD

- **Read:** List from API.
- **Update/Delete (if present):** Edit/delete message; persist and list updates.

## Functionality / interactions

- Edit message → /bucket/[id]/messages/[messageId]/edit.
- Back to bucket → bucket detail.
- Pagination (if present): next page loads correctly.
- Delete message (if present): confirmation dialog; cancel leaves message; confirm removes and list updates.

## Edge / error states

- API error: message; no crash.
- Empty list: empty state.
- Invalid messageId on edit: notFound.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket; assert list or empty state; optional create/edit one message.
