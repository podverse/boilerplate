# E2E: Management-web – Bucket detail – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]`.
- **Objective:** Verify bucket name, owner, isPublic, links (Edit, Settings, Messages), child buckets/topics list when applicable; permission (bucketsCrud read); Edit/New/Delete visibility by bucketsCrud and bucketMessagesCrud; 404 for invalid id.

## Selector strategy

- Heading: bucket name.
- Detail list: owner, isPublic, etc.
- Links: Edit, Settings, Messages; New bucket / New message when permitted.
- Child list: table or list of child buckets/topics with links.
- Delete (if present): button + confirmation.

## Assertion matrix

### Layout

- Initial load: wait for content or loading to settle; optionally assert loading indicator or placeholder until data loads, then content replaces it (no permanent loading).
- Bucket name as heading; detail list (owner, isPublic).
- Links: Edit (or redirect to settings), Settings, Messages; New bucket / New message when permitted.
- Child buckets/topics list if top-level; main nav visible.
- Breadcrumbs: when bucket has ancestors, breadcrumb chain visible (e.g. parent bucket > current); links navigate correctly.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated with buckets read | Load /bucket/[id] | Page loads; content matches bucket. |
| Unauthenticated | Load | Redirect to /login. |
| Invalid bucket id | Load /bucket/invalid | notFound (404). |
| No permission | Load | 403 or redirect. |

### Values / display

- Bucket name, owner, isPublic match API.
- Child list (if shown): names, dates; links to detail and messages.
- Edit/New/Delete visible only when bucketsCrud or bucketMessagesCrud permits (super admin or permission bits).
- Messages tab is hidden when the admin lacks `bucketMessagesCrud` read; Settings tab is shown only for top-level buckets with update permission; Public page tab appears only for public buckets.

### Interaction

- Edit → /bucket/[id]/edit (or settings).
- Settings → /bucket/[id]/settings.
- Messages → /bucket/[id]/messages.
- New bucket → /bucket/[id]/new when permitted.
- New message or topic → correct route when permitted.
- Sort (if child list has sort): column sort toggles order; URL params (sortBy, sortOrder) update; when URL has no sort params, default or cookie value applied; table order matches.
- Delete (if present): destructive action — confirmation dialog visible with expected wording; Cancel closes dialog without change; Confirm performs action and updates list/redirect.
- Accessibility: primary actions (Edit, Settings, Messages, New bucket, delete) focusable; tab order reasonable.

## CRUD

- **Read:** Data from management API.
- **Update:** Edit link → edit/settings; save persists.
- **Delete (if present):** Confirmation; confirm deletes; cannot delete when not permitted.

## Edge / error states

- 404 for invalid id: notFound.
- API error: message.
- No permission: 403 or redirect.

## Test data mapping

- **Seeded bucket:** E2E bucket id from seed; assert name, owner, links, child list.
- **Permission:** Super admin sees Edit/New/Delete; non–super admin with bucketsCrud update sees Edit; bucketMessagesCrud for message actions.
- **Invalid id:** Non-existent → 404.

## Screenshot and trace checkpoints

- Bucket detail: "mgmt-bucket-detail".
- With children: "mgmt-bucket-detail-with-children".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket detail spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-detail.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/page.tsx`.
- Test: auth redirect; valid bucket layout and permission-based buttons; invalid id 404.
