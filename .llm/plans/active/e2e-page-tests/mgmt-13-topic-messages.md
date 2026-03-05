# E2E: Management-web – Topic messages

## Route

(main)/bucket/[id]/topic/[topicId]/messages.

## Layout conditions to test

- Initial load: wait for messages list or empty state (or loading) before asserting.
- Page title; messages list or empty state; link back to topic.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with read:** Messages load.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket or topic id:** notFound (404).
- **No permission:** 403.

## Values / display conditions

- Messages match API; topic and bucket context visible.
- Empty state when no messages.

## CRUD

- **Read:** List from API.
- **Update/Delete (if present):** Edit/delete message; persist.

## Functionality / interactions

- Edit message → message edit page.
- Back → topic detail.
- Pagination (if present): works correctly.
- Delete message (if present): confirmation dialog; cancel leaves message; confirm removes and list updates.

## Edge / error states

- API error: message.
- Empty list: empty state.
- Invalid messageId: notFound on edit.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded topic; assert list or empty state.
