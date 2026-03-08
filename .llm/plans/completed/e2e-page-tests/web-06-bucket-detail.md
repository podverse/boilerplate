# E2E: Web – Bucket detail – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]` (id = bucket UUID or shortId).
- **Objective:** Verify bucket name, owner, isPublic, child buckets list, inline messages view, links (Settings, Messages, Add bucket, Public page when public), and delete flow; 404 for invalid id; redirect when child bucket id used as if top-level.

## Selector strategy

- Heading/title: bucket name as heading or prominent text.
- Detail list: region with "Is public", "Owner", "Admins" labels and values.
- Links/tabs: `getByRole('link', { name: /settings|messages|add bucket|public page|buckets/i })`.
- Buckets table: `getByRole('table')` with columns Name, Last message, Created, Actions (view/edit/delete).
- Empty state: "No buckets" or equivalent when no children.
- Delete: button + confirmation dialog (confirm/cancel).

## Assertion matrix

### Layout

- Initial load: wait for bucket content or loading to settle; optionally assert loading indicator or placeholder visible until data loads, then assert content replaces it (no permanent loading).
- Bucket name as heading; detail list (Is public, Owner, Admins) with labels and values.
- Links/tabs: Settings, Messages; when top-level: Buckets list, Add bucket, Public page (only when isPublic).
- Bucket detail defaults to the Messages tab/content on `/bucket/[id]`; messages render inline on the detail page rather than requiring a separate standalone list page.
- Buckets table (top-level): columns Name, Last message, Created, Actions; or empty state when no children.
- Main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated, valid bucket | Load /bucket/[id] | Page loads; content matches bucket. |
| Unauthenticated | Load /bucket/[id] | Redirect to login. |
| Valid bucket but child id | Load with child bucket id in top-level URL | Redirect to child bucket detail URL (shortId) so child not rendered as top-level. |
| Invalid / non-existent id | Load /bucket/invalid | notFound (404); no crash. |

### Values / display

- Bucket name matches seed (e.g. "E2E Bucket One").
- Is public: "Yes"/"No" (or translated) matches bucket.isPublic.
- Owner: email and/or display name (e.g. "e2e@example.com (E2E User)" or "(owner)").
- Admins: when present, shows admin emails/names and owner label; empty when no extra admins.
- Child buckets: names, dates; links use correct shortIds.
- Public link: visible only when bucket is public; hidden when private.

### Interaction

- Settings link → /bucket/[id]/settings.
- Messages link → /bucket/[id]/messages.
- Add bucket → /bucket/[id]/new (or bucket/new).
- Bucket view/edit links → correct bucket detail routes.
- Public page link (when visible) → public bucket URL (e.g. /b/[shortId]).
- Messages tab/link keeps the same bucket selected and shows the inline messages section on the detail page.
- Sort: column sort toggles order; URL params (sortBy, sortOrder) update; when URL has no sort params, default or cookie value applied; table order matches.
- Delete bucket (if present): destructive action — confirmation dialog visible with expected wording; Cancel closes dialog without change; Confirm performs action and updates list/redirect.
- Accessibility: primary actions (links, delete button) focusable; tab order reasonable.

## CRUD

- **Read:** All displayed data reflects API for this bucket.
- **Delete (if exposed):** Delete works; redirect or list update; no stale data.

## Edge / error states

- 404 for invalid id: notFound page; no server error.
- Child bucket: redirect to child detail; no wrong layout.
- Redirect from `/bucket/[id]/messages` lands on `/bucket/[id]` and the messages section is visible after redirect.
- API failure: error message or retry; no uncaught error.

## Test data mapping

- **Seeded bucket:** E2E Bucket One/Two; ids/shortIds from seed (see tools/web/seed-e2e.mjs).
- Assert name, owner, isPublic, child list match seed.
- **Invalid id:** Non-UUID or non-existent → 404.

## Screenshot and trace checkpoints

- Bucket detail loaded: "bucket-detail-with-children".
- Public bucket: "bucket-detail-public-link-visible".
- Empty children: "bucket-detail-empty-children".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; bucket detail spec with seeded bucket id.

## Implementation notes

- Spec: `apps/web/e2e/bucket-detail.spec.ts`.
- Page: `apps/web/src/app/(main)/bucket/[id]/page.tsx`.
- Test: unauthenticated redirect; valid bucket layout and values; public link visibility; invalid id 404; optional delete flow.
