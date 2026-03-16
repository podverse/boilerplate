# E2E improvement: Management-web Admin edit

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/admin-edit.spec.ts`

## Current state

- Permission-gated: Yes (management admins)
- Alignment status: Needs alignment
- Brief: Unauthenticated redirect, super-admin sees form and save persistence; missing super-admin vs other roles, invalid id, list→edit, Cancel→list, Save→list flows.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (admin-edit-page, admin-edit-form).
- **Permission actor matrix:** Admin without admins CRUD → not found; invalid admin id → not found; list→edit (from admins list to edit), Cancel→list, Save→list (already has save persistence; add explicit Cancel and list→edit).
- **AuthZ matrix:** Self-edit vs other admin edit (if different); super-admin vs limited admin.
- **CRUD state matrix:** Update persistence already present; add post-save list visibility assertion.
- **URL state:** N/A.
- **Flows:** Admins list → edit link → edit page; Cancel → admins list; Save → admins list (already partially covered).

## Steps to implement

1. Add test: invalid admin id → not found (super-admin).
2. Add test: admin without admins edit permission opens admin edit → not found.
3. Add test: super-admin navigates from admins list to edit (list→edit); add test: Cancel returns to admins list (Cancel→list).
4. Ensure Save→list: after save, assert URL is /admins and list shows updated admin (already in spec; confirm assertion).
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/admin-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: invalid admin id → not found (super-admin); setE2EUserContext and hyphenated terms (admin-edit-page, admin-edit-form, admins-list-page); URL/form assertions inside actionAndCapture; list→edit (admins list → edit link → admin-edit-form); Cancel→list; Save→list with URL /admins and list shows updated admin, capturePageLoad after. Deferred: admin without admins edit → not found (no limited-admin user seeded; comment in spec). Targeted spec not run locally (Xcode license exit 69).
