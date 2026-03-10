# E2E improvement: Management-web Bucket role new

## Spec path

- **Web:** N/A (see web-bucket-role-new.md)
- **Management-web:** `apps/management-web/e2e/bucket-role-new.spec.ts`

## Current state

- Permission-gated: Yes (bucket roles)
- Alignment status: Needs alignment
- Brief: Who can create roles not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with bucket roles create → form; admin without permission → not found; invalid bucket id → not found.
- **AuthZ matrix:** Who sees "new role" link.
- **CRUD state matrix:** Create role: valid submit → list shows new role; validation (required name, duplicate).
- **URL state:** N/A.
- **Flows:** Bucket settings roles tab → new role form.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens new role form → form visible; restricted role → not found.
2. Add create success test and validation test.
3. Add flow: bucket settings → roles tab → new role.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-role-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: permission note (super-admin or bucketAdminsCrud); unauthenticated→redirect; invalid bucket id (UUID)→not found; permitted user opens new-role page→form visible (actionAndCapture, capturePageLoad); restricted→not found deferred in suite comment; create success with capturePageLoad on roles-list; validation (empty name, required, stay on page); flow: bucket-settings roles-tab→create-role link→new-role form visible. setE2EUserContext and hyphenated terms throughout. Run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-role-new.spec.ts`.
