# E2E: Web – Short URL send message (topic)

## Route

(main)/b/[id]/t/[topicId]/send-message.

## Layout conditions to test

- Form for message (sender name, body).
- Submit button; optional back to topic view.
- Topic and bucket context visible.

## Auth / redirect conditions

- **Valid public bucket and topic:** Form loads; submit allowed.
- **Invalid bucket or topic short_id:** notFound (404).
- **Private bucket/topic:** notFound or redirect.
- **Topic not in bucket:** notFound.

## Values / display conditions

- After submit: success or redirect; new message visible on public topic page when applicable.
- Topic/bucket name in context correct.
- Validation for required fields and max length.

## CRUD

- **Create:** Submit → message created in topic; success feedback.

## Functionality / interactions

- Required fields validated; submit with loading state; success message or redirect.
- Back → public topic view.
- Rate limiting (if present): handled with message or modal.

## Edge / error states

- API error: error message; form retained.
- Invalid/private bucket or topic: notFound on load. Invalid short_id format (wrong length/chars): 404; no 500.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded public bucket and topic short_ids; submit message; assert success and visibility on topic page.
