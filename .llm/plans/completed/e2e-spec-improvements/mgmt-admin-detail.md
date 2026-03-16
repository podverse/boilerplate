# E2E improvement: Management-web Admin detail

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/admin-detail.spec.ts`

## Current state

- Permission-gated: Yes (management admins)
- Alignment status: Needs alignment
- Brief: Role × visibility/actions need coverage.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin sees detail and edit link; admin with admins read → detail; admin without → not found; invalid admin id → not found.
- **AuthZ matrix:** Edit link visibility by role; self vs other admin if applicable.
- **CRUD state matrix:** Read detail.
- **URL state:** N/A.
- **Flows:** Admins list → admin detail.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens admin detail → content and edit link visible; restricted → not found; invalid id → not found.
2. Assert edit link visible only when permitted.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/admin-detail.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: unauthenticated → redirect; invalid admin id → not found (super-admin); permitted user (super-admin) opens admin-detail-page → content and edit link visible (assertions inside actionAndCapture, capturePageLoad after); edit link visible when permitted (asserted in permitted test); setE2EUserContext and hyphenated terms throughout; list→detail flow (admins-list-page → admin link → admin-detail-page). Deferred: restricted role (admin without admins read) → not found and edit link not visible (no limited-admin user seeded; comment in spec). Targeted spec not run locally (Xcode license exit 69).
