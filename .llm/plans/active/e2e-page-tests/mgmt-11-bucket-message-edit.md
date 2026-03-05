# E2E: Management-web – Edit bucket message

## Route

(main)/bucket/[id]/messages/[messageId]/edit.

## Layout conditions to test

- Form: sender name, body, isPublic (or equivalent); save and cancel.
- Bucket context visible; main nav visible.

## Auth / redirect conditions

- **Authenticated admin with update:** Form loads; save allowed.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket or messageId:** notFound (404).
- **Message not found:** notFound.
- **No permission:** 403.

## Values / display conditions

- Form pre-filled with current message; bucket/topic context correct.
- After save: message list and detail show updated content.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Save persists; list updates.

## Functionality / interactions

- Required fields validated; save with loading state; success redirect to messages list. Double-click save: only one update. Browser back after save: no duplicate submit.
- Cancel → bucket messages list.
- Body max length (if enforced): validation error.

## Edge / error states

- API error: message; form retained.
- Message deleted: 404 or conflict on save.
- Invalid messageId: notFound on load.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed or create message; edit and assert pre-fill and update.
