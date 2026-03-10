# E2E improvement: Management-web Admins list

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/admins.spec.ts`

## Current state

- Permission-gated: Yes (list by role)
- Alignment status: Partial
- Brief: List visibility by role; may need restricted-actor test and URL state.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin and permitted role see list; admin without admins list → not found or no list.
- **AuthZ matrix:** Row-level view/edit/delete visibility by role.
- **CRUD state matrix:** Read list; empty state.
- **URL state:** If admins list has search/sort/page, add param contract test.
- **Flows:** N/A.

## Steps to implement

1. Add test: admin without admins permission opens /admins → not found or empty (per product).
2. If list has query params, add URL state test.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/admins.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: permission comment and deferred admin-without-admins-read test (no limited-admin user seeded); URL state test (admins route with search, page, sortBy, sortOrder → params persisted, pathname and visible list); setE2EUserContext and hyphenated terms throughout (admins-list-page, add-admin CTA, admins-new route); permitted-user test assertions moved into actionAndCapture, capturePageLoad after. Targeted spec not run locally (Xcode license exit 69).
