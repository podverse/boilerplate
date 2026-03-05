# E2E: Management-web – Topic detail

## Route

(main)/bucket/[id]/topic/[topicId].

## Layout conditions to test

- Initial load: wait for topic content or loading to settle before asserting.
- Topic name as heading; detail (created, parent bucket link).
- Links: Messages, Edit (if present), back to bucket.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin, valid topic:** Page loads; content matches topic.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket or topic id:** notFound (404).
- **Topic not in bucket:** notFound.
- **No permission:** 403.

## Values / display conditions

- Topic name and dates match API; parent bucket link correct.
- Bucket context in breadcrumb.

## CRUD

- **Read:** Data from API.
- **Update/Delete (if present):** Edit or delete topic; delete shows confirmation dialog (cancel leaves topic; confirm deletes and redirect); persist and redirect.

## Functionality / interactions

- Messages link → topic messages page.
- Back to bucket → bucket detail.
- Edit (if present) → topic edit; save persists.

## Edge / error states

- Invalid topicId: notFound.
- API error: message.
- No permission: 403.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket and topic; assert name, parent link, messages link.
