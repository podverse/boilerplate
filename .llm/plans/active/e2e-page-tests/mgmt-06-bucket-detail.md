# E2E: Management-web – Bucket detail

## Route

(main)/bucket/[id].

## Layout conditions to test

- Initial load: wait for bucket content or loading to settle before asserting.
- Bucket name as heading; detail list (owner, isPublic, etc.).
- Links: Edit (or redirect to settings), Settings, Messages; Topics section if top-level bucket.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated admin with read:** Page loads; content matches bucket.
- **Unauthenticated:** Redirect to login.
- **Invalid bucket id:** notFound (404).
- **No permission:** 403 or redirect.

## Values / display conditions

- Bucket name, owner, isPublic match main DB/API.
- Topics list (if shown): names, dates; links to topic detail and messages.
- Settings and Messages links point to correct bucket.

## CRUD

- **Read:** Data from management API (or main API via management).
- **Update:** Edit link → bucket edit (or settings); save persists.
- **Delete (if present):** Confirmation dialog; cancel leaves bucket; confirm deletes and bucket removed from list.

## Functionality / interactions

- Edit → bucket edit page or settings.
- Settings → bucket settings.
- Messages → bucket messages list.
- Topic view/edit → topic detail and messages.
- Create topic (if present) → topic new.

## Edge / error states

- 404 for invalid id: notFound.
- API error: error message.
- No permission: 403 or redirect.

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded bucket id; assert name, owner, links, and topic list.
