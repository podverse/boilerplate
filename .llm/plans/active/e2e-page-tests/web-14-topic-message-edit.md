# E2E: Web – Edit topic message

## Route

(main)/bucket/[id]/topic/[topicId]/messages/[messageId]/edit.

## Layout conditions to test

- Form with sender name, body, isPublic (or equivalent).
- Save and cancel/back buttons.
- Page title or heading indicates edit message.
- Topic/bucket context visible.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with update permission:** Form loads; save allowed.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket, topic, or messageId:** notFound (404).
- **Message not in this topic:** notFound.
- **No permission:** 403 or redirect.

## Values / display conditions

- Form pre-filled with current message (sender, body, isPublic).
- Topic and bucket context in breadcrumb or title.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Save persists; message list and detail show updated content.

## Functionality / interactions

- Required fields validated; save with loading state; success redirect to topic messages list.
- Double-click save: only one update. Browser back after save: no duplicate submit.
- Cancel/back → topic messages without saving.
- Body max length (if enforced): validation when exceeded.

## Edge / error states

- API error on save: error message; form retained.
- Message deleted: 404 or conflict on save.
- Invalid messageId: notFound on load.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed or create a topic message; edit and assert pre-fill and update round-trip.
