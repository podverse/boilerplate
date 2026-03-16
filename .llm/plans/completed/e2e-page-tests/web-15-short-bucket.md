# E2E: Web – Short URL bucket (public) – Detailed Plan

## Route and objective

- **Route:** `(main)/b/[id]` — id is bucket short_id (public view).
- **Objective:** Verify public bucket view shows bucket name and public messages only; private bucket redirect or 404; invalid short_id 404; send-message link when allowed; no internal UUID leak.

## Selector strategy

- Bucket name/title: heading or prominent text.
- Messages list: public messages only (or empty state).
- Send message: `getByRole('link', { name: /send message/i })`.
- No main app nav for anonymous (or minimal); nav when logged in.
- Use shortId in URL (e.g. from seed e2ebucket00001).

## Assertion matrix

### Layout

- Bucket name or title visible.
- Public bucket content: messages list or placeholder when public; read-only view.
- Link "Send message" when allowed (public bucket).
- No full app nav for anonymous; or nav when logged in.
- No infinite redirect.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Valid public bucket short_id | Load /b/[shortId] | Page loads; content visible (messages or empty). |
| Valid private bucket short_id | Load /b/[shortId] | Redirect to login or 403/404; private content not exposed. |
| Invalid or non-existent short_id | Load /b/invalid | notFound (404). |
| Authenticated on public bucket | Load /b/[shortId] | Same content; possibly send message or nav. |

### Values / display

- Bucket name matches seed for that short_id.
- Only public messages (isPublic true) visible; non-public hidden from anonymous.
- Dates and sender names formatted; empty state when no public messages.
- Public messages respect selected sort order and pagination state.

### Interaction

- Send message link → /b/[id]/send-message (or login then send).
- No write/edit/delete for anonymous (or clear CTA to log in).
- Links do not expose internal UUIDs.
- Sort and pagination (if present): changing sort updates URL and rendered order; pagination preserves selected sort.
- When no sort param is present and a saved public-message sort preference exists, the page restores the saved sort on first load.
- Accessibility: primary actions (Send message link) focusable; tab order reasonable.

## CRUD

- **Read:** Only public data visible; no write without auth.

## Edge / error states

- Invalid short_id: notFound; no 500.
- Wrong length or invalid chars: 404 or validation error.
- Private bucket: notFound or redirect to login; no content leak.
- Deleted bucket: notFound.

## Test data mapping

- **Public bucket:** Seeded bucket with short_id (e.g. e2ebucket00001); isPublic true; assert name and public messages.
- **Private bucket:** Seeded private bucket short_id; assert no content or redirect.
- **Invalid:** Non-existent short_id → 404.

## Screenshot and trace checkpoints

- Public bucket: "short-bucket-public-view".
- Empty public messages: "short-bucket-empty-public".
- Private redirect: "short-bucket-private-redirect".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; short bucket spec.

## Implementation notes

- Spec: `apps/web/e2e/short-bucket.spec.ts` or b.spec.ts.
- Page: `apps/web/src/app/(main)/b/[id]/page.tsx`.
- Test: public load; private redirect/404; invalid 404; optional authenticated view.
