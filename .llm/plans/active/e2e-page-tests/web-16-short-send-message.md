# E2E: Web – Short URL send message (bucket)

## Route

(main)/b/[id]/send-message — id = bucket short_id.

## Layout conditions to test

- Form for submitting a message (e.g. sender name, body); may be minimal for public submit.
- Submit button and optional cancel/link back to public bucket view.
- Bucket name or context visible.
- No app nav or minimal (public flow).

## Auth / redirect conditions

- **Valid public bucket:** Form loads; submit allowed (anonymous or with validation).
- **Invalid bucket short_id:** notFound (404).
- **Private bucket:** notFound or redirect; form not visible.
- **Optional: authenticated user** may see different form or validation.

## Values / display conditions

- After submit: success message or redirect to public bucket view; new message visible if public and allowed.
- Bucket context matches short_id.
- Validation messages for required fields (sender, body) and max length.

## CRUD

- **Create:** Submit valid sender name and body → message created in bucket; success feedback; message appears on public bucket page when isPublic.

## Functionality / interactions

- Required fields: sender name and body validated; empty submit shows errors.
- Body max length (if enforced): validation error when exceeded.
- Submit: loading state; success message or redirect; no double submit.
- Rate limiting (if present): too many submits show rate-limit message or modal.
- Cancel/back → public bucket view (/b/[id]).

## Edge / error states

- API error: error message; form retained.
- Bucket full or closed for submissions: clear message.
- Invalid or private bucket: notFound on load. Invalid short_id format (wrong length/chars): 404; no 500.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use public bucket short_id; submit one message; assert success and message visible on public bucket page.
