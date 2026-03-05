# E2E: Management-web – Edit topic message

## Route

(main)/bucket/[id]/topic/[topicId]/messages/[messageId]/edit.

## Layout conditions to test

- Form: sender, body, isPublic; save and cancel; topic/bucket context.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with update:** Form loads; save allowed.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket, topic, or messageId:** notFound (404).
- **Message not in topic:** notFound.
- **No permission:** 403.

## Values / display conditions

- Form pre-filled; context correct.
- After save: message list shows updated content.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Save persists.

## Functionality / interactions

- Required fields validated; save with loading state; success redirect. Double-click save: only one update. Browser back after save: no duplicate submit.
- Cancel → topic messages list.
- Body max length: validation when exceeded.

## Edge / error states

- API error: message; form retained.
- Message deleted: 404 or conflict.
- Invalid messageId: notFound on load.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed or create topic message; edit and assert pre-fill and update.
