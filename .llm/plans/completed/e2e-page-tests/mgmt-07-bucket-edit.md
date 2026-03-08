# E2E: Management-web – Bucket edit (redirect) – Detailed Plan

## Route and objective

- **Route:** `(main)/bucket/[id]/edit`.
- **Objective:** Verify single redirect to bucket settings; no dedicated edit layout; invalid id 404 after redirect or at redirect target.

## Selector strategy

- URL assertion: after `goto('/bucket/[id]/edit')`, expect URL to contain `/bucket/[id]/settings`.
- Optional: one stable element on settings page (e.g. settings heading or form).

## Assertion matrix

### Layout

- Redirect only; no dedicated edit layout; no infinite redirect.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Visit /bucket/[id]/edit | Redirect to /bucket/[id]/settings; settings page loads. |
| Unauthenticated | Visit /bucket/[id]/edit | Redirect to /login (from edit or after redirect to settings). |
| Invalid bucket id | Visit /bucket/invalid/edit | notFound (at redirect target or before). |
| No permission | Visit edit | 403 on settings after redirect. |

### Values / display

- N/A (redirect); after redirect, settings page shows bucket data (see mgmt-08).

### Interaction

- Single redirect from edit to settings; then settings behavior applies.
- Accessibility: primary links on resulting settings page focusable; tab order reasonable.

## CRUD

- N/A for this route; actual edit on settings page.

## Edge / error states

- Invalid id: notFound on settings or redirect target.
- No permission: 403 on settings.

## Test data mapping

- **Valid bucket id:** From seed; assert redirect to settings and settings load.
- **Invalid id:** Non-existent → 404.

## Screenshot and trace checkpoints

- After redirect: "mgmt-bucket-edit-redirect-to-settings".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_management_web`; bucket edit spec.

## Implementation notes

- Spec: `apps/management-web/e2e/bucket-edit.spec.ts`.
- Page: `apps/management-web/src/app/(main)/bucket/[id]/edit/page.tsx`.
- Test: authenticated redirect to settings; unauthenticated redirect to login; invalid id 404.
