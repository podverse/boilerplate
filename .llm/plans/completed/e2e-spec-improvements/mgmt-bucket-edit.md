# E2E improvement: Management-web Bucket edit

## Spec path

- **Web:** N/A (no web bucket-edit; web has bucket-settings)
- **Management-web:** `apps/management-web/e2e/bucket-edit.spec.ts`

## Current state

- Permission-gated: Yes (bucket update)
- Alignment status: Needs alignment
- Brief: Who can edit bucket and flows (list→edit, Cancel→list, Save→list) need coverage.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with bucket update → form; admin without → not found; invalid bucket id → not found; list→edit, Cancel→list, Save→list.
- **AuthZ matrix:** Edit link visibility in buckets list by role.
- **CRUD state matrix:** Update bucket (name, etc.) and persistence after save.
- **URL state:** N/A.
- **Flows:** Buckets list → bucket edit; Cancel → list; Save → list and updated data visible.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens bucket edit → form; restricted → not found; invalid id → not found.
2. Add flow tests: from buckets list click edit → edit page; Cancel → list; Save → list and revisit or list shows updated name.
3. Add persistence assertion: after save, reload list or detail and assert updated value.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect; invalid bucket id→not found (expectInvalidRouteShowsNotFound); permitted user→redirect to settings + form visible (actionAndCapture, capturePageLoad); restricted→not found deferred in suite comment (no limited-admin seeded); list→edit via edit link with URL and form assertions; Cancel→bucket-view (detail) with URL assertion; Save→bucket-view then list search with updated name for persistence. setE2EUserContext and hyphenated terms throughout. Run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-edit.spec.ts`.
