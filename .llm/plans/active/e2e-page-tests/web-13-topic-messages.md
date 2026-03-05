# E2E: Web – Topic messages

## Route

(main)/bucket/[id]/topic/[topicId]/messages.

## Layout conditions to test

- Initial load: wait for messages list or empty state (or loading to settle) before asserting.
- Page title or heading indicates topic messages.
- Messages list (sender, body, date, actions) or empty state.
- Link to add message (if supported) and back to topic or bucket.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with read access:** Messages load.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket or topic id:** notFound (404).
- **Topic not in bucket:** notFound.

## Values / display conditions

- Messages show sender, body, date; order matches API.
- Empty state when no messages; topic and bucket context visible.
- Topic name in heading or breadcrumb.

## CRUD

- **Read:** List matches API for this topic's messages.
- **Create:** Add message → form; submit persists; list updates.
- **Update/Delete:** Edit/delete message; persist and list updates.

## Functionality / interactions

- Edit message link → message edit page with correct messageId.
- Create message (if present): form and submit; new message in list.
- Back to topic → topic detail.
- Pagination (if present): next page loads correctly.
- Delete message (if present): confirmation dialog; cancel leaves message; confirm removes and list updates.

## Edge / error states

- API error: error message; no crash.
- Empty list: empty state.
- Invalid messageId on edit: notFound.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded topic; assert empty or seeded messages; test create one message.
