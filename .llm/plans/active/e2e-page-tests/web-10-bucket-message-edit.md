# E2E: Web – Edit bucket message

## Route

(main)/bucket/[id]/messages/[messageId]/edit.

## Layout conditions to test

- Form with fields for sender name, body, isPublic (or equivalent).
- Save and cancel/back buttons visible.
- Page title or heading indicates edit message.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with update permission:** Form loads; save allowed.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket id or messageId:** notFound (404).
- **Message not found:** notFound.
- **No permission:** 403 or redirect; form not editable.

## Values / display conditions

- Form pre-filled with current message: sender name, body, isPublic match stored message.
- Bucket context visible (name or breadcrumb).

## CRUD

- **Read:** Pre-fill from API for this message.
- **Update:** Changing fields and saving persists; message list and detail show updated content; no duplicate message.

## Functionality / interactions

- Required fields: body and sender name (if required) validated; empty submit shows errors.
- Save: loading state; success redirect to messages list or detail.
- Double-click save: only one update. Browser back after save: no duplicate submit.
- Cancel/back → bucket messages list without saving.
- Body max length (if enforced): validation error when exceeded.

## Edge / error states

- API error on save: error message; form data retained.
- Message deleted elsewhere: 404 or conflict on save; clear message.
- Invalid messageId: notFound on page load.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Seed a bucket message or create one; open edit; assert pre-fill and one update round-trip.
