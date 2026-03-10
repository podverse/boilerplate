# E2E improvement: Management-web Bucket role edit

## Spec path

- **Web:** N/A (see web-bucket-role-edit.md)
- **Management-web:** `apps/management-web/e2e/bucket-role-edit.spec.ts`

## Current state

- Permission-gated: Yes (bucket roles)
- Alignment status: Needs alignment
- Brief: Actor matrix for management roles and flows likely missing.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin (or role with bucket roles CRUD) → edit form, invalid id → not found; admin without permission → not found; list→edit, Cancel→list, Save→list.
- **AuthZ matrix:** Who sees edit link in roles list by management role.
- **CRUD state matrix:** Update role and persistence; validation if applicable.
- **URL state:** N/A.
- **Flows:** list→edit, Cancel→list, Save→list.

## Steps to implement

1. Establish management permission for bucket roles (e.g. bucketRolesCrud or part of bucket settings).
2. Add tests: unauthenticated → redirect; super-admin (or permitted role) opens role edit → form; invalid role id → not found; admin without permission → not found.
3. Add flow tests: navigate from bucket settings roles tab to edit; Cancel → roles list; Save → roles list and updated name visible.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-role-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: permission note (super-admin or bucketAdminsCrud); unauthenticated→redirect; invalid role id (UUID)→not found; permitted user navigates from roles-tab to edit via edit link→form visible (actionAndCapture, capturePageLoad); restricted→not found deferred in suite comment; flow: list→edit (create role then click edit), Cancel→roles-list (settings?tab=roles), Save→roles-list and updated name visible with capturePageLoad. setE2EUserContext and hyphenated terms throughout. Run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-role-edit.spec.ts`.
