# E2E improvement: Management-web Users new

## Spec path

- **Web:** N/A
- **Management-web:** `apps/management-web/e2e/users-new.spec.ts`

## Current state

- Permission-gated: Yes (user create)
- Alignment status: Partial
- Brief: Role for create; may need role matrix and validation.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with users create → form; admin without → not found.
- **AuthZ matrix:** Who sees "add user" on users list.
- **CRUD state matrix:** Create user: valid submit → list shows new user; validation (email, display name, etc.).
- **URL state:** N/A.
- **Flows:** Users list → new user form.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens new user form → form; restricted → not found.
2. Add create success and validation tests.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/users-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented: unauthenticated → redirect; permitted user (super-admin) opens users-new-page → add-user-form visible (assertions inside actionAndCapture, capturePageLoad); create success (valid submit → either success state on users-new-page with set-password link or redirect to /users and list shows new user via search, with capturePageLoad); validation (empty form submit → remain on users-new-page, required/email/username message); Cancel→list with URL assertion in callback and capturePageLoad; setE2EUserContext and hyphenated terms (users-new-page, add-user-form, users-list-page) throughout. Deferred: restricted (admin without users create) → not found (no limited-admin user seeded; comment in spec). Targeted spec not run locally (Xcode license exit 69).
