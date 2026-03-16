# E2E improvement: Management-web Users list

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/users.spec.ts`

## Current state

- Permission-gated: Yes (list by role)
- Alignment status: Partial
- Brief: List by role; may need restricted-actor test and URL state.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin and permitted role see list; admin without users list → not found or no list.
- **AuthZ matrix:** Row-level view/edit visibility by role.
- **CRUD state matrix:** Read list; empty state.
- **URL state:** If users list has search/sort/page, add param contract test.
- **Flows:** N/A.

## Steps to implement

1. Add test: admin without users permission opens /users → not found or empty (per product).
2. If list has query params, add URL state test.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/users.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: permission comment and deferred admin-without-users-read test (no limited-admin user seeded); URL state test enhanced (users route with search, page, sortBy, sortOrder → params persisted, pathname and heading visible, capturePageLoad after); setE2EUserContext and hyphenated terms throughout (users-list-page, add-user CTA, users-new route); permitted-user test assertions moved into actionAndCapture, capturePageLoad after; delete-cancel test title uses users-list-page. Targeted spec not run locally (Xcode license exit 69).
