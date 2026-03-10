# E2E improvement: Web Bucket admin edit

## Spec path

- **Web:** `apps/web/e2e/bucket-admin-edit.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-admin-edit.md)

## Current state

- Permission-gated: Yes
- Alignment status: Aligned (reference implementation)
- Brief: Full actor matrix (unauthenticated, owner, non-owner with/without permission, non-admin), invalid id → not found, list→edit, Cancel→list, Save→list, owner row read-only.

## Gaps (skills)

- **Readability:** Optional: ensure all step labels use hyphenated compound terms consistently (e.g. bucket-admin-edit-page, bucket-admin-edit-form).
- **Permission actor matrix:** None.
- **AuthZ matrix:** None.
- **CRUD state matrix:** None.
- **URL state:** N/A (edit page).
- **Flows:** None.

## Steps to implement

1. Review step labels and describe/test titles for hyphenated compound-term consistency; fix any that use space-separated terms for the same concept.
2. Run targeted spec and confirm no regressions.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-admin-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Reviewed and fixed step labels and test titles for hyphenated compound-term consistency—replaced "edit page" → bucket-admin-edit-page, "edit form" → bucket-admin-edit-form, "admins list" → admins-list, "bucket settings admins tab" → bucket-settings-admins-tab where referring to the same concept. Step 2: Targeted run requested; local run blocked by Xcode license—run `make e2e_test_web_report_spec SPEC=e2e/bucket-admin-edit.spec.ts` to confirm no regressions.
- **Verification:** Run `make e2e_test_web_report_spec SPEC=e2e/bucket-admin-edit.spec.ts` to confirm.
