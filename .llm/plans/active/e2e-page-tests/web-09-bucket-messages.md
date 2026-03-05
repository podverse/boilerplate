# E2E: Web – Bucket messages

## Route

(main)/bucket/[id]/messages.

## Layout conditions to test

- Initial load: wait for messages list or empty state (or loading indicator to settle) before asserting.
- Page title or heading indicates bucket messages.
- Messages list or table (sender, body, date, public/private, actions) or empty state.
- Link or button to add/create message (if supported).
- Link back to bucket detail visible.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with read access:** Messages load; create/link visible if permitted.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket id:** notFound (404).
- **No message permission:** Empty list or 403; no create action if not permitted.

## Values / display conditions

- Messages show sender name, body (truncated if needed), created date, isPublic indicator.
- Order matches API (e.g. by created_at); pagination if present.
- Empty state: when no messages, clear empty message and optional create CTA.
- Bucket context (name or breadcrumb) visible.

## CRUD

- **Read:** List matches API for this bucket; only messages user is allowed to see.
- **Create:** Add message link/button → create form or inline; submit persists message; list updates.
- **Update/Delete:** Edit/delete per message (if shown); actions persist and list updates.

## Functionality / interactions

- Click message or edit → message edit page with correct messageId.
- Create message → new message form; submit success and redirect or list refresh.
- Pagination or load more: next page loads; no duplicate or missing items.
- Filter by public/private (if present): list updates correctly.
- Delete message (if present): confirmation dialog; cancel leaves message; confirm removes message and list updates.

## Edge / error states

- API error loading messages: error message; no crash.
- Empty list: empty state; no "undefined" in UI.
- Invalid messageId on edit: notFound when navigating to edit.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket; assert empty or seeded messages; test create one message and see it in list.
