# E2E: Web – Buckets list

## Route

(main)/buckets.

## Layout conditions to test

- Initial load: wait for content or loading indicator to settle before asserting list; no assertion on rows before load completes.
- Page title (e.g. "Buckets") and table or list container visible.
- Column headers present (e.g. Name, Public/private).
- "Add bucket" or "New bucket" CTA visible when authenticated.
- Filter/search input visible when the page supports it.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user:** Buckets list loads; add-bucket link present.
- **Unauthenticated user:** Redirect to login; buckets list not visible.

## Values / display conditions

- Table shows buckets from seed (e.g. "E2E Bucket One", "E2E Bucket Two") with correct public/private labels (e.g. "Yes"/"No" or translated equivalent).
- Row count matches seeded buckets for the user.
- No stale or wrong-owner buckets shown.
- Empty state: when user has no buckets, empty message (e.g. "No buckets") shown and add-bucket still available.

## CRUD

- **Read:** List reflects API response; each row links to bucket detail or is clickable.
- **Create:** "New bucket" link goes to (main)/buckets/new.

## Functionality / interactions

- Search/filter: entering text filters list (or triggers search); URL query params updated if applicable; results match filter.
- Refresh: if page uses URL params for search/filter, reload preserves params and list state.
- Clicking a bucket row or name navigates to bucket detail with correct id/shortId.
- Add bucket link navigates to create form.
- No infinite request loop when typing in search.

## Edge / error states

- API error (e.g. 500): error message (e.g. "Failed to load buckets") shown; table not in broken state.
- Empty list: empty message displayed; no "undefined" or raw error in UI.
- Invalid or empty filter: graceful behavior; no crash.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Assert seed bucket names and public/private values appear correctly.
