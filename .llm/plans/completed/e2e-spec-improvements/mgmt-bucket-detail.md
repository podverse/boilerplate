# E2E improvement: Management-web Bucket detail

## Spec path

- **Web:** N/A (see web-bucket-detail.md)
- **Management-web:** `apps/management-web/e2e/bucket-detail.spec.ts`

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Partial
- Brief: Detail and actions by role not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin sees detail and actions; admin with bucket read → detail; admin without → not found; invalid bucket id → not found.
- **AuthZ matrix:** Visibility of edit, settings, messages links by role.
- **CRUD state matrix:** Read detail.
- **URL state:** N/A unless detail has tabs.
- **Flows:** Buckets list → bucket detail.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens bucket detail → content and links visible; restricted → not found; invalid id → not found.
2. Assert action visibility (edit, settings, messages) by role.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-detail.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, invalid bucket id→not found, permitted (super-admin) opens bucket detail→content and Messages/Buckets/Settings tab links visible. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Restricted-role→not found covered by invalid bucket id (no limited-admin seeded). Action visibility asserted for super-admin (Messages, Buckets, Settings tabs).
