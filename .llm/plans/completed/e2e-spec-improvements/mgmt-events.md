# E2E improvement: Management-web Events (audit)

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/events.spec.ts`

## Current state

- Permission-gated: Yes (audit by role)
- Alignment status: Partial
- Brief: Visibility by role; URL/table state may need strengthening.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin and permitted role see events list; admin without events/audit permission → not found or no list.
- **AuthZ matrix:** N/A (read-only audit list).
- **CRUD state matrix:** Read list; empty state; loading/error if applicable.
- **URL state:** If events have search/sort/filter/date, add query-param contract test and assert table content matches.
- **Flows:** N/A.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens events → list or empty; restricted → not found.
2. Add URL state test if events page has query params; assert visible table state matches URL.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/events.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, permitted (super-admin) opens events→list or empty state visible, URL state test (sort, search, page persist) with visible table or empty content asserted. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Restricted→not found deferred until limited-admin seeded.
