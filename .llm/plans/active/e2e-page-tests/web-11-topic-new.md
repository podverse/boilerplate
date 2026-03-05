# E2E: Web – New topic

## Route

(main)/bucket/[id]/topic/new.

## Layout conditions to test

- Form for creating a topic (e.g. name, optional slug).
- Submit and cancel/back buttons visible.
- Page title or heading indicates create topic.
- Bucket context (name or breadcrumb) visible.
- Main nav visible.

## Auth / redirect conditions

- **Authenticated user with create permission on bucket:** Form loads; submit allowed.
- **Unauthenticated user:** Redirect to login.
- **Invalid bucket id:** notFound (404).
- **Bucket not found:** notFound.
- **No permission:** 403 or redirect.

## Values / display conditions

- After create: redirect to topic detail or bucket detail with topics list; new topic appears with submitted name.
- Bucket name in context matches current bucket.

## CRUD

- **Create:** Submit valid name (and slug if present) → topic created under this bucket; redirect or list update shows new topic.
- **Validation:** Empty or invalid name shows error; no create.

## Functionality / interactions

- Required field (name): validation on empty submit.
- Slug (if editable): optional or auto-generated; uniqueness validated if applicable.
- Submit: loading state; success redirect; new topic visible in bucket's topic list or topic detail.
- Double-click submit: only one topic created. Browser back after submit: no duplicate create.
- Cancel/back → bucket detail without creating.

## Edge / error states

- Duplicate name/slug: error message; form retained.
- API error: error message; form retained.
- Parent bucket is actually a topic: notFound or redirect (topics only under top-level bucket).

## Data

Use E2E deterministic seed (see [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)). Use seeded top-level bucket; create one topic; assert it appears under bucket and has correct name.
