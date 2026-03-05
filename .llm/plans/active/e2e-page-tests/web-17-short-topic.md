# E2E: Web – Short URL topic (public)

## Route

(main)/b/[id]/t/[topicId] — id = bucket short_id, topicId = topic short_id.

## Layout conditions to test

- Topic name or title visible.
- Public topic content: messages list or empty state; read-only.
- Link to send message to topic (if supported).
- Bucket/topic context or breadcrumb.
- No infinite redirect.

## Auth / redirect conditions

- **Valid public bucket and topic:** Page loads; topic content visible.
- **Invalid bucket or topic short_id:** notFound (404).
- **Private bucket/topic:** notFound or redirect; content not exposed.
- **Topic not in bucket:** notFound.

## Values / display conditions

- Topic name matches seed/API.
- Public messages in topic visible; non-public hidden for anonymous.
- Bucket name in context correct.
- Empty state when no public messages.

## CRUD

- **Read:** Only public data; no write without auth.

## Functionality / interactions

- Send message link → /b/[id]/t/[topicId]/send-message.
- Back or bucket link → public bucket view.
- No edit/delete for anonymous.

## Edge / error states

- Invalid short_ids: notFound. Invalid short_id format (wrong length/chars): 404; no 500.
- Private bucket/topic: notFound or redirect.
- Topic is top-level bucket: notFound (wrong route).

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed public bucket and topic; use short_ids; assert topic name and message visibility.
