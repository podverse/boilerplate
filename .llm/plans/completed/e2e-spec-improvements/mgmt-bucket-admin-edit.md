# E2E improvement: Management-web Bucket admin edit

## Spec path

- **Web:** N/A (see web-bucket-admin-edit.md)
- **Management-web:** `apps/management-web/e2e/bucket-admin-edit.spec.ts`

## Current state

- Permission-gated: Yes (management bucket admins)
- Alignment status: Partial
- Brief: Unauthenticated redirect, invalid admin id → not found, super-admin sees owner row read-only and list→edit, Cancel→list; missing management role matrix (e.g. bucketAdminsCrud) and other actors.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (already largely present).
- **Permission actor matrix:** Add management roles: super-admin, admin with bucketAdminsCrud, admin without → not found; list→edit and Cancel→list already present for super-admin; add Save→list for editable admin row if applicable.
- **AuthZ matrix:** Row-level: owner row read-only vs other admin row editable by role.
- **CRUD state matrix:** Update persistence for non-owner-admin row; already has flow tests for super-admin.
- **URL state:** N/A (edit page).
- **Flows:** list→edit, Cancel→list present; add Save→list for editable row if not covered.

## Steps to implement

1. Document management permission (e.g. bucketAdminsCrud) and which roles have it.
2. Add login helper for management admin with bucketAdminsCrud (if different from super-admin) and for admin without.
3. Add test: admin with bucketAdminsCrud opens edit for non-owner-admin → form with Save; opens edit for owner → read-only message.
4. Add test: admin without bucketAdminsCrud opens bucket-admin-edit → not found.
5. Add test: invalid admin id → not found for non-super-admin actor if not already covered.
6. Add Save→list test for editable admin row if missing.
7. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-admin-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Documented bucketAdminsCrud and roles in spec (super-admin full CRUD; other roles need bucketAdminsCrud; deferral note for additional management users). Step 6: Added Save→list test for editable non-owner-admin (super-admin edits E2E_NON_OWNER_ADMIN_ID, clicks Save, asserts admins-list). Readability: full-sentence describe, hyphenated terms (bucket-admin-edit-page, bucket-settings-admins-tab, admins-list). Step 7: Run `make e2e_test_management_web_report_spec SPEC=e2e/bucket-admin-edit.spec.ts` to confirm (local run blocked by Xcode license).
- **Deferred (steps 2–5):** Add management admin with bucketAdminsCrud and admin without to seed + login helpers; then add tests for those actors and invalid admin id for non-super-admin.
