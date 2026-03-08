# E2E: Web – Buckets list – Detailed Plan

## Route and objective

- **Route:** `(main)/buckets`.
- **Objective:** Verify list shows only user's buckets with correct names and public/private; add-bucket CTA; search/filter and empty state; unauthenticated redirect.

## Selector strategy

- Table/list: `getByRole('table')` or region with list semantics; rows by role or data attributes.
- Headers: column headers (Name, Public/private, etc.).
- Add bucket: `getByRole('link', { name: /add bucket|new bucket/i })`.
- Search/filter: `getByRole('searchbox')` or `getByLabel(/search|filter/i)`.
- Empty state: text "No buckets" or equivalent.
- Row links: bucket name or first cell link to detail.

## Assertion matrix

### Layout

- Initial load: wait for list or loading to settle before asserting rows.
- Page title/heading (e.g. "Buckets"); table or list container visible.
- Column headers (Name, Public/private, or app equivalents).
- "Add bucket" or "New bucket" CTA visible when authenticated.
- Filter/search input if supported; main nav visible.

### Auth / redirect conditions

| Condition | Action | Expected result |
| --------- |--------|-----------------|
| Authenticated | Load /buckets | List loads; add-bucket link present. |
| Unauthenticated | Load /buckets | Redirect to login; list not visible. |

### Values / display

- Table shows buckets from seed (e.g. "E2E Bucket One", "E2E Bucket Two") with correct public/private labels ("Yes"/"No" or translated).
- Row count matches seeded buckets for the user.
- No stale or wrong-owner buckets.
- Empty state: when user has no buckets, empty message and add-bucket still available.
- Dates (created, last message) formatted correctly if columns exist.

### Interaction

- Search/filter: entering text filters list or updates URL params; results match filter; no infinite request loop.
- Refresh: URL params (search, sort) preserved; list state same after reload.
- Click bucket row/name → bucket detail with correct id/shortId.
- Add bucket link → /buckets/new.
- Sort (if present): column sort updates list and URL.
- Accessibility: primary actions (Add bucket link, row links) focusable; tab order reasonable.

## CRUD

- **Read:** List reflects API; each row links to bucket detail.
- **Create:** "New bucket" → /buckets/new.

## Edge / error states

- API error (500): error message (e.g. "Failed to load buckets"); table not broken.
- Empty list: empty message; no "undefined" or raw error in UI.
- Invalid filter: graceful behavior; no crash.

## Test data mapping

- **Seeded buckets:** E2E Bucket One, E2E Bucket Two (see tools/web/seed-e2e.mjs); assert names and public/private.
- **Empty state:** Use user with no buckets (or truncate bucket membership in test) to assert empty message.

## Screenshot and trace checkpoints

- List loaded: "buckets-list-with-seed-data".
- Empty state: "buckets-list-empty-state".
- After filter: "buckets-list-filtered".
- On failure: trace and screenshot.

## Verification commands

- `make e2e_test_web`; buckets list spec after seed.

## Implementation notes

- Spec: `apps/web/e2e/buckets.spec.ts` or list spec.
- Page: `apps/web/src/app/(main)/buckets/page.tsx`.
- Test: unauthenticated redirect; list with seed data; add bucket link; optional search/filter and empty state.
