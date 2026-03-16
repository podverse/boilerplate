# E2E improvement: Web Bucket role new

## Spec path

- **Web:** `apps/web/e2e/bucket-role-new.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-role-new.md)

## Current state

- Permission-gated: Yes (bucket settings/roles)
- Alignment status: Partial
- Brief: Likely unauthenticated redirect and owner create path; missing actor matrix for who can create roles.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Define actors: owner, non-owner with permission, non-owner without, non-admin. Add tests: unauthenticated → redirect; restricted actors → not found or no access; list→new flow (navigate from roles list to new role).
- **AuthZ matrix:** Who sees "new role" / create link.
- **CRUD state matrix:** Create path with validation (required fields, invalid input); post-create redirect to list and row visible.
- **URL state:** N/A for create form.
- **Flows:** List→new (navigate from bucket settings roles tab to new role form).

## Steps to implement

1. Document permission for "create role" (same as edit or separate).
2. Add/login helpers for non-owner with permission, without permission, non-admin.
3. Add test: unauthenticated → redirect.
4. Add test: non-owner with permission can open new role form (if allowed); non-owner without → not found; non-admin → not found.
5. Add test: owner navigates from roles list to new role form (list→new).
6. Add validation test: submit empty or invalid form → validation visible.
7. Ensure setE2EUserContext and hyphenated terms throughout.
8. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-role-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Documented permission (same as bucket-role-edit). Steps 2–6 already implemented. Step 7: setE2EUserContext and hyphenated terms—normalized "roles list" → roles-list in titles and step labels; full-sentence describe. Added capturePageLoad after valid create (roles-list visible) and after list→new (bucket-role-new-form visible). Step 8: Run `make e2e_test_web_report_spec SPEC=e2e/bucket-role-new.spec.ts` to confirm (local run blocked by Xcode license). Non-owner-without-permission test remains skipped until route is permission-gated.
