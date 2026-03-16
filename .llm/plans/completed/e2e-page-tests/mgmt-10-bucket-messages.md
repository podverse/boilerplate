# E2E: Management-web – Bucket messages – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/messages`.
- **Objective:** Verify `/bucket/[id]/messages` performs the expected redirect back to the bucket page/messages view, preserves bucket context, and does not expose a stale standalone management messages page.

## Selector strategy

- Redirect target URL and the bucket page/messages view after redirect.
- Message rows and actions inside the bucket page/messages view.
- Create message action when permitted.

## Assertion matrix

### Layout

- Redirect completes without loop.
- After redirect, the same bucket remains selected and the messages view is visible.
- Create message action is visible when permitted.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with bucketMessagesCrud read | Load messages | Single redirect to `/bucket/[id]`; messages view visible; create action visible if permitted. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id | Load | notFound (404). |
| No permission | Load | Redirect resolves safely; no create action and messages view is restricted or empty per app behavior. |

### Values / display

- Messages show sender, body, date, isPublic; order matches API within the bucket page/messages view.
- Empty state when no messages; bucket context visible after redirect.
- Edit/delete actions visible only when bucketMessagesCrud update/delete.

### Interaction

- Click message or edit → /bucket/[id]/messages/[messageId]/edit from the bucket page/messages view.
- Create message → new message form or inline; submit persists; list updates when permitted.
- Delete (if present): destructive action — confirmation dialog visible with expected wording; Cancel closes dialog without change; Confirm removes message and list updates.
- Pagination/load more if present: next page; no duplicate items.
- Accessibility: primary actions (create message, row links, delete) focusable; tab order reasonable.

## CRUD

- **Read:** Redirect target and bucket page/messages view match API; scoped by permission.
- **Create:** Add message when permitted; list updates.
- **Update/Delete:** Edit/delete when permitted; list updates.

## Edge / error states

- Redirect loop never occurs.
- API error: message; no crash.
- Empty list: empty state; no "undefined".
- Invalid messageId on edit: notFound.

## Test data mapping

- **Seeded bucket:** E2E bucket; redirect target should still resolve to this bucket page.
- **Create:** When permitted, add one message; assert in list.
- **Permission:** bucketMessagesCrud read/create/update/delete; super admin has full access.

## Screenshot and trace checkpoints

- Redirect landed on bucket/messages view: "mgmt-bucket-messages-redirect".
- Empty state: "mgmt-bucket-messages-empty".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket messages spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-messages.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/messages/page.tsx` (redirect), with message UI on the bucket page.
