# E2E improvement: Management-web Admins new

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/admins-new.spec.ts`

## Current state

- Permission-gated: Yes (management admins create)
- Alignment status: Partial
- Brief: Role for create; may need role matrix and validation.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with admins create → form; admin without → not found.
- **AuthZ matrix:** Who sees "add admin" on admins list.
- **CRUD state matrix:** Create admin: valid submit → list shows new admin; validation (username, display name, etc.).
- **URL state:** N/A.
- **Flows:** Admins list → new admin form.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens new admin form → form; restricted → not found.
2. Add create success and validation tests.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/admins-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: unauthenticated → redirect; permitted user (super-admin) opens admins-new-page → add-admin-form visible (assertions inside actionAndCapture, capturePageLoad); create success (valid display name, username, password → redirect to /admins, list shows new admin via search); validation (empty username + submit → remain on page, username-required message visible); setE2EUserContext and hyphenated terms (admins-new-page, add-admin-form) throughout. Deferred: restricted (admin without admins create) → redirect/not found (no limited-admin user seeded; comment in spec). Targeted spec not run locally (Xcode license exit 69).
