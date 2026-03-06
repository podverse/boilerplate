# E2E: Web – Bucket detail

## Route

(main)/bucket/[id] (id = bucket UUID or slug as used by app).

## Layout conditions to test

- Initial load: wait for bucket content or loading indicator to settle before asserting; no assertion on detail before load completes.
- Bucket name as heading or prominent title.
- Detail list (e.g. Is public, Owner, Admins) visible with labels and values.
- Links present: Settings, Messages, and when bucket is top-level: Buckets list, Add bucket, Public page (if isPublic).
- Buckets table (for top-level bucket): columns Name, Last message, Created, Actions (view/edit/delete); or empty state when no buckets.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user, valid bucket:** Page loads; content matches bucket.
- **Unauthenticated user:** Redirect to login.
- **Valid bucket but child bucket id used:** Redirect to child bucket detail URL (short ids) so child is not rendered as top-level bucket.
- **Invalid or non-existent bucket id:** notFound (404); no crash.

## Values / display conditions

- Bucket name matches seed (e.g. "E2E Bucket One").
- Is public: "Yes" or "No" (or translated) matches bucket.isPublic.
- Owner: displayed as email and/or display name (e.g. "e2e@example.com (E2E User)" or " (owner)"); anonymous when no email/name.
- Admins list: when present, shows admin emails/names and owner label; empty when no extra admins.
- Buckets: names, created/last-message dates formatted correctly; links use correct shortIds.
- Public link: visible only when bucket is public; hidden when private.

## CRUD

- **Read:** All displayed data reflects API/fetch for this bucket.
- **Delete (if exposed):** Delete bucket actions work and redirect or update list; no stale data.

## Functionality / interactions

- Settings link → bucket settings page.
- Messages link → bucket messages page.
- Add bucket link → new bucket page for this bucket.
- Bucket view/edit links → correct bucket detail/edit routes.
- Public page link (when visible) → public bucket URL (short id).
- Delete bucket (if present): confirmation dialog; cancel leaves bucket; confirm removes bucket and list updates or redirect.

## Edge / error states

- 404 for invalid id: notFound page or 404 response; no server error.
- Bucket is child (parent_bucket_id set): redirect to child bucket detail; no wrong layout.
- API failure: error message or retry; no uncaught error.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket ids/shortIds; assert name, owner, isPublic, and bucket list match seed.
