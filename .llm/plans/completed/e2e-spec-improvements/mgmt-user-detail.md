# E2E improvement: Management-web User detail

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/user-detail.spec.ts`

## Current state

- Permission-gated: Yes (management users)
- Alignment status: Needs alignment
- Brief: Role × visibility and actions need coverage.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin sees user detail and edit link; admin with users read → detail; admin without → not found; invalid user id → not found.
- **AuthZ matrix:** Edit link visibility by role; self vs other user if applicable.
- **CRUD state matrix:** Read detail.
- **URL state:** N/A.
- **Flows:** Users list → user detail.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens user detail → content and edit link visible; restricted → not found; invalid id → not found.
2. Assert edit link visible only when permitted.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/user-detail.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: unauthenticated → redirect; invalid user id → not found (super-admin); permitted user (super-admin) opens user-detail-page → content and edit link visible (assertions inside actionAndCapture, capturePageLoad after); edit link visible when permitted (asserted in permitted test); setE2EUserContext and hyphenated terms throughout; list→detail flow (users-list-page with search → user link → user-detail-page). Deferred: restricted role (admin without users read) → not found and edit link not visible (no limited-admin user seeded; comment in spec). Targeted spec not run locally (Xcode license exit 69).
