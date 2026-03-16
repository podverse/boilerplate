# E2E improvement: Management-web Admin role new

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/admin-role-new.spec.ts`

## Current state

- Permission-gated: Yes (management roles)
- Alignment status: Needs alignment
- Brief: Who can create admin roles not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with admin-roles create → form; admin without → not found; list→new flow.
- **AuthZ matrix:** Who sees "new admin role" link.
- **CRUD state matrix:** Create admin role: valid submit → list shows new role; validation.
- **URL state:** N/A.
- **Flows:** Admin roles list or settings → new role form.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens new admin role form → form visible; restricted → not found.
2. Add create success and validation tests.
3. Add flow: from roles list/settings to new role form.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/admin-role-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: unauthenticated → redirect; permitted user (super-admin) opens admin-role-new-page → form visible (assertions inside actionAndCapture, capturePageLoad); create success (valid role name → redirect to /admins, capturePageLoad); validation (empty role name + Create role → remain on page); flow from admins-list → add-admin form → select Custom Role → admin-role-new-form loads; setE2EUserContext and hyphenated terms throughout. Deferred: restricted (admin without admin-roles create) → not found (no limited-admin user seeded; comment in spec). Targeted spec not run locally (Xcode license exit 69).
