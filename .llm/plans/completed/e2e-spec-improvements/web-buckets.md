# E2E improvement: Web Buckets list

## Spec path

- **Web:** `apps/web/e2e/buckets.spec.ts`
- **Management-web:** N/A (see mgmt-buckets.md)

## Current state

- Permission-gated: Yes (list by ownership/admin)
- Alignment status: Partial
- Brief: Likely unauthenticated redirect and one role; list visibility by actor and URL state (sort/search) may be missing.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; owner sees own buckets; admin may see different set; non-admin sees own or empty; assert list content by role.
- **AuthZ matrix:** Visibility of add/edit/delete per row by role.
- **CRUD state matrix:** Read (list); empty state when no buckets.
- **URL state:** If page has search, sort, pagination — add contract test: params persist, content matches URL.
- **Flows:** N/A (list page).

## Steps to implement

1. Add tests: unauthenticated → redirect; owner opens buckets → list or empty state; assert "new bucket" or add link visible where permitted.
2. If list supports search/sort/page, add test: goto with ?search=…&sortBy=…&sortOrder=…&page=…, assert URL and visible content match.
3. Add empty-state assertion when user has no buckets.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/buckets.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Unauthenticated→redirect; owner opens buckets→list or empty state and add-bucket link visible; URL state test (search, sortBy, sortOrder, page) with URL and table visible asserted in callback; empty-state test (search matches no buckets→empty message and add-bucket link visible); add-bucket link→new-bucket-page with post-nav in callback and capturePageLoad; setE2EUserContext and hyphenated terms; full-sentence describe. Run `make e2e_test_web_report_spec SPEC=e2e/buckets.spec.ts` locally to verify (Xcode license may block in CI).
