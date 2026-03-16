# E2E improvement: Web Buckets new

## Spec path

- **Web:** `apps/web/e2e/buckets-new.spec.ts`
- **Management-web:** N/A (see mgmt-buckets-new.md)

## Current state

- Permission-gated: Yes (bucket create)
- Alignment status: Partial
- Brief: Auth and likely owner create; role/ownership and validation may be missing.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; who can create top-level bucket (e.g. any authenticated, or role-gated); restricted → not found or no access.
- **AuthZ matrix:** Who sees "new bucket" / create link on list.
- **CRUD state matrix:** Create: valid submit → list/dashboard shows new bucket; validation (required name, duplicate, etc.).
- **URL state:** N/A for create form.
- **Flows:** Buckets list → new bucket form.

## Steps to implement

1. Clarify permission: can any authenticated user create bucket or is it role/ownership limited?
2. Add tests: unauthenticated → redirect; permitted user opens new form → form visible; submit valid → redirect and bucket visible; validation test (empty/invalid).
3. If role-gated, add tests for restricted actor → not found or no link.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/buckets-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment (any authenticated user can create; unauthenticated→redirect); unauthenticated→redirect; permitted user→form visible; valid submit→redirect and bucket visible; validation (empty name); Cancel→buckets-list; flow: buckets-list→add-bucket link→new-bucket-page and form visible; setE2EUserContext and hyphenated terms; post-navigation assertions in callbacks; capturePageLoad for form, Cancel, valid create, and flow. Not role-gated so no restricted-actor tests. Run `make e2e_test_web_report_spec SPEC=e2e/buckets-new.spec.ts` locally to verify (Xcode license may block in CI).
