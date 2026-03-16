# E2E: Web – Edit bucket message – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/messages/[messageId]/edit`.
- **Objective:** Verify form pre-fill, update persistence, validation (required fields, body max length), cancel and double-submit behavior; 404 for invalid bucket/message; permission (only users with update can edit).

## Selector strategy

- Sender name: `getByLabel(/sender|name/i)` or first textbox.
- Body: `getByLabel(/body|message/i)` or textarea.
- isPublic: `getByRole('checkbox', { name: /public/i })` or toggle.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to messages list.
- Validation: `getByRole('alert')` or inline errors.

## Assertion matrix

### Layout

- Initial load: optionally assert loading or placeholder until message data loads; then assert form pre-filled (no permanent loading).
- Form: sender name, body, isPublic (or equivalents).
- Save and cancel/back visible; heading indicates edit message.
- Bucket context (name or breadcrumb) visible; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with update permission | Load edit | Form loads; save allowed. |
| Unauthenticated | Load edit | Redirect to login. |
| Invalid bucket id or messageId | Load with invalid ids | notFound (404). |
| No permission | Load edit | 403 or redirect; form not editable. |

### Values / display

- Form pre-filled: sender name, body, isPublic match stored message.
- Bucket context visible.

### Interaction

- Required fields: body and sender name (if required) validated; empty submit shows errors.
- Save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); success redirect to messages list or detail.
- Double-click save: only one update; browser back after save: no duplicate submit.
- Cancel/back → messages list without saving.
- Body max length (if enforced): when body exceeds bucket max length, submit button disabled or validation error shown; no submit until body within limit.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API for this message.
- **Update:** Change fields and save; message list and detail show updated content; no duplicate.

## Edge / error states

- API error on save: error message; form retained.
- Message deleted elsewhere: 404 or conflict on save; clear message.
- Invalid messageId: notFound on page load.

## Test data mapping

- **Seeded or created message:** Use bucket + message from seed or create in test.
- **Edit:** Change body and/or isPublic; assert list shows updated content on return.
- **Invalid messageId:** Non-existent or wrong bucket → 404.

## Screenshot and trace checkpoints

- Form pre-filled: "bucket-message-edit-form".
- Validation error: "bucket-message-edit-validation".
- After save: "bucket-message-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; message edit spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-message-edit.spec.ts`.
- Page: `apps/web/src/app/(main)/bucket/[id]/messages/[messageId]/edit/page.tsx`.
- Test: unauthenticated redirect; pre-fill and one update round-trip; validation; invalid id 404.
