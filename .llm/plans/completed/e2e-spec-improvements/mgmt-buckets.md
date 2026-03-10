# E2E improvement: Management-web Buckets list

## Spec path

- **Web:** N/A (see web-buckets.md)
- **Management-web:** `apps/management-web/e2e/buckets.spec.ts`

## Current state

- Permission-gated: Yes (list by role)
- Alignment status: Partial
- Brief: Unauthenticated redirect, super-admin sees list and add CTA, query params persist, delete flow; list and filters by role and URL state already partially covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Admin without buckets list permission → not found or empty; assert list visibility by role.
- **AuthZ matrix:** Row-level edit/delete visibility by role.
- **CRUD state matrix:** Read list; delete already covered; empty state.
- **URL state:** Already has query-param test (search, page, sortBy, sortOrder); ensure visible content matches URL.
- **Flows:** N/A (list page).

## Steps to implement

1. Add test: admin without buckets permission opens /buckets → not found or no list (per product).
2. Assert post-navigation and URL state with visible table content.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/buckets.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, permitted (super-admin) sees buckets-list and add-bucket link, add-bucket link→buckets-new page, URL state test (search, page, sortBy, sortOrder persist) with post-navigation assertion (heading and table or empty state visible), delete flow. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Admin without buckets permission→redirect to dashboard (per product); deferred until limited-admin seeded.
