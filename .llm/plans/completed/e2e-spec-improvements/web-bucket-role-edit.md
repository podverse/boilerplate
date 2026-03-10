# E2E improvement: Web Bucket role edit

## Spec path

- **Web:** `apps/web/e2e/bucket-role-edit.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-role-edit.md)

## Current state

- Permission-gated: Yes (bucket settings/roles)
- Alignment status: Partial
- Brief: Unauthenticated redirect, invalid role id → not found, owner edit/save and delete custom role; no non-owner or non-admin actors, no explicit list→edit or Cancel→list flow tests.

## Gaps (skills)

- **Readability:** Ensure full-sentence titles/labels and setE2EUserContext; hyphenated terms (bucket-role-edit-page, etc.).
- **Permission actor matrix:** Missing: non-owner admin with permission, non-owner admin without permission, non-admin; invalid id for non-owner; list→edit, Cancel→list flows.
- **AuthZ matrix:** Missing visibility/disabled assertions by role (who sees edit/delete on list).
- **CRUD state matrix:** Update persistence and delete flow covered; add explicit post-save revisit assertion if needed.
- **URL state:** Tab param for settings?tab=roles if applicable.
- **Flows:** Add test: navigate from roles list to edit; add test: Cancel returns to roles list.

## Steps to implement

1. Add login helpers for non-owner with permission, non-owner without permission, non-admin (or reuse from bucket-admin-edit pattern).
2. Add test: unauthenticated → redirect (already present); ensure setE2EUserContext on all tests.
3. Add test: non-owner admin with bucket roles permission opens edit → form visible; invalid role id → not found.
4. Add test: non-owner admin without permission opens bucket-role-edit → not found.
5. Add test: non-admin opens bucket-role-edit → not found.
6. Add test: owner navigates from roles list to edit (list→edit) and Cancel returns to roles list (Cancel→list).
7. Normalize step labels and titles to hyphenated compound terms and full sentences.
8. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-role-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Steps 1–6 already implemented (helpers reused, setE2EUserContext, unauthenticated redirect, non-owner with/without permission, non-admin, list→edit, Cancel→list). Step 7: Normalized "roles list" → roles-list in all test titles and step labels; full-sentence describe. Added capturePageLoad for roles-list after Cancel. Step 8: Run `make e2e_test_web_report_spec SPEC=e2e/bucket-role-edit.spec.ts` to confirm (local run blocked by Xcode license). **Skipped:** AuthZ matrix (who sees edit/delete on list) not added.
