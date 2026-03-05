# E2E: Web – Topic detail

## Route

(main)/bucket/[id]/topic/[topicId].

## Layout conditions to test

- Topic name as heading or title.
- Detail list (e.g. created date, parent bucket link).
- Links: Messages for this topic, Edit topic, Delete (if permitted), back to bucket.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user, valid topic:** Page loads; content matches topic.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket or topic id:** notFound (404).
- **Topic not in this bucket:** notFound or 404.

## Values / display conditions

- Topic name matches seed or API.
- Created date (and last message if shown) formatted correctly.
- Parent bucket link shows correct bucket name and links to bucket detail.
- Bucket context in breadcrumb or title correct.

## CRUD

- **Read:** All displayed data from API for this topic.
- **Update (if edit link):** Edit topic page; save persists name/slug.
- **Delete (if present):** Delete confirms and removes topic; redirect to bucket detail; topic gone from list.

## Functionality / interactions

- Messages link → topic messages page for this topic.
- Edit link → topic edit (if route exists) or inline edit.
- Back to bucket → bucket detail with topics list.
- Delete: confirmation dialog; cancel leaves topic unchanged; confirm performs delete, redirect to bucket detail, and topic no longer in bucket's topic list.

## Edge / error states

- Invalid topicId: notFound.
- Topic is top-level bucket (parent_bucket_id null): should not be reached via topic route; or redirect.
- API error: error message or retry.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed a topic under a bucket; assert name, parent link, and messages link work.
