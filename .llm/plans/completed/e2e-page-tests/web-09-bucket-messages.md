# E2E: Web – Bucket messages – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/messages`.
- **Objective:** Verify `/bucket/[id]/messages` redirects back to bucket detail/messages view, preserves bucket context, and does not expose a stale standalone messages page.

## Selector strategy

- Redirect target URL and the bucket detail/messages section after redirect.
- Messages list/table within bucket detail: rows with sender, body, date, public/private, actions (edit/delete).
- Add message action within the bucket detail/messages view when permitted.
- Empty state within the bucket detail/messages view when no messages exist.

## Assertion matrix

### Layout

- Redirect completes without loop.
- After redirect, the bucket detail page remains selected for the same bucket and the messages section is visible.
- Messages list or table (sender, body, date, public/private, actions) or empty state renders inside bucket detail.
- Add/create message action is visible when permitted.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with read access | Load messages | Single redirect to `/bucket/[id]`; messages section visible; create action visible if permitted. |
| Unauthenticated | Load messages | Redirect to login. |
| Invalid bucket id | Load /bucket/invalid/messages | notFound (404). |
| No message permission | Load messages | Redirect still resolves safely; no create action and messages view is restricted or empty per app behavior. |

### Values / display

- Messages show sender name, body (truncated if needed), created date, isPublic within the detail page.
- Order matches API (e.g. created_at); pagination correct if present.
- Empty state: clear message and optional create CTA.
- Bucket context (name or breadcrumb) remains visible after redirect.

### Interaction

- Click message or edit → /bucket/[id]/messages/[messageId]/edit from the inline messages section.
- Create message → new message form or inline; submit persists; list updates.
- Pagination/load more: next page loads; no duplicate or missing items.
- Filter by public/private (if present): list updates.
- Delete message (if present): destructive action — confirmation dialog visible with expected wording; Cancel closes dialog without change; Confirm removes message and list updates.
- Accessibility: primary actions (create message, row links, delete) focusable; tab order reasonable.

## CRUD

- **Read:** Redirect target and inline messages list match the bucket detail/messages view for this bucket.
- **Create:** Add message → form; submit persists; list updates.
- **Update/Delete:** Edit/delete per message; actions persist; list updates.

## Edge / error states

- Redirect loop never occurs.
- API error loading messages: error message; no crash.
- Empty list: empty state; no "undefined" in UI.
- Invalid messageId on edit: notFound when navigating.

## Test data mapping

- **Seeded bucket:** E2E Bucket One; redirect target should still resolve to this bucket detail page.
- **Create:** Add one message; assert it appears in the inline messages view with correct sender/body/isPublic.
- **Edit/delete:** Use seeded or created message; assert inline list updates after edit/delete.

## Screenshot and trace checkpoints

- Redirect landed on detail/messages view: "bucket-messages-redirect-to-detail".
- Empty state: "bucket-messages-empty".
- After create: "bucket-messages-after-create".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket messages redirect/detail spec.

## Implementation notes

- Spec: `apps/web/e2e/bucket-messages.spec.ts`.
- Page: `apps/web/src/app/(main)/bucket/[id]/messages/page.tsx` (redirect), with message UI on `apps/web/src/app/(main)/bucket/[id]/page.tsx`.
- Test: unauthenticated redirect; authenticated redirect to bucket detail/messages view; create one message; optional edit/delete and pagination.
