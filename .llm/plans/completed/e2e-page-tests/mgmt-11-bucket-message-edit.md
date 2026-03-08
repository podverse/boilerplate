# E2E: Management-web – Bucket message edit – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/messages/[messageId]/edit`.
- **Objective:** Verify form pre-fill, update persistence, validation, cancel and double-submit; 404 for invalid bucket/message; permission (bucketMessagesCrud update).

## Selector strategy

- Sender: `getByLabel(/sender|name/i)`.
- Body: `getByLabel(/body|message/i)` or textarea.
- isPublic: checkbox or toggle.
- Save: `getByRole('button', { name: /save|update/i })`.
- Cancel/back: link to messages list.
- Validation: `getByRole('alert')` or inline.

## Assertion matrix

### Layout

- Form: sender, body, isPublic; save and cancel; bucket context; main nav.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with bucketMessagesCrud update | Load edit | Form loads; save allowed. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id or messageId | Load | notFound (404). |
| No permission | Load | 403 or redirect. |

### Values / display

- Pre-fill: sender, body, isPublic match stored message.
- After save: messages list shows updated content.

### Interaction

- Required fields validated; empty submit shows errors.
- Save: assert primary button is disabled or shows loading during request; assert it re-enables after success or error (no stuck loading); success redirect to messages list; one update on double-click.
- Cancel → messages list without saving.
- Body over bucket max length: submit button disabled or validation error shown; no submit until body within limit.
- Accessibility: primary actions (save, cancel) focusable; tab order reasonable.

## CRUD

- **Read:** Pre-fill from API.
- **Update:** Change and save; list reflects; no duplicate.

## Edge / error states

- API error: error; form retained.
- Message deleted elsewhere: 404 or conflict on save.
- Invalid messageId: notFound.

## Test data mapping

- **Bucket and message:** From seed or create in test.
- **Edit:** Change body/isPublic; assert list shows update.
- **Invalid ids:** Non-existent → 404.

## Screenshot and trace checkpoints

- Form: "mgmt-bucket-message-edit-form".
- After save: "mgmt-bucket-message-edit-saved".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; message edit spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-message-edit.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/messages/[messageId]/edit/page.tsx`.
