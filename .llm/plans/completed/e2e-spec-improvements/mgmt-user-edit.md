# E2E improvement: Management-web User edit

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/user-edit.spec.ts`

## Current state

- Permission-gated: Yes (management users)
- Alignment status: Needs alignment
- Brief: Unauthenticated redirect, super-admin sees form and save persistence; conditional not-found handling; missing role × edit, self-protection, invalid id, list→edit, Cancel→list.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (user-edit-page, user-edit-form).
- **Permission actor matrix:** Admin without users edit → not found; invalid user id → not found; list→edit, Cancel→list, Save→list; self-edit (if allowed) vs other user edit.
- **AuthZ matrix:** Role × edit; self-protection (e.g. cannot demote self, or limited self-edit).
- **CRUD state matrix:** Update persistence (already present); ensure post-save list or detail shows updated value.
- **URL state:** N/A.
- **Flows:** Users list → user edit; Cancel → users list; Save → users list.

## Steps to implement

1. Add test: invalid user id → not found (super-admin).
2. Add test: admin without users edit permission opens user edit → not found.
3. Add test: super-admin navigates from users list to edit (list→edit); Cancel returns to users list (Cancel→list).
4. If self-edit is restricted or different, add test for editing own user (e.g. limited form or not found).
5. Replace conditional expect(hasFormField) with deterministic assertions (either form or not-found page per URL/role).
6. setE2EUserContext and hyphenated terms throughout.
7. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/user-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: invalid user id → not found (super-admin, expectInvalidRouteShowsNotFound); permitted user opens user-edit-page → user-edit-form (deterministic assertions, no conditional hasFormField); list→edit (users list with search → edit link → user-edit-form); Cancel→list; Save→list (URL /users and list shows updated display name in callback, capturePageLoad after); setE2EUserContext and hyphenated terms throughout. Deferred: admin without users edit → not found, self-edit test (no limited-admin user / explicit self-edit behavior; comment in spec). Targeted spec not run locally (Xcode license exit 69).
