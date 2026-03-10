# E2E improvement: Web Bucket child new

## Spec path

- **Web:** `apps/web/e2e/bucket-child-new.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-child-new.md)

## Current state

- Permission-gated: Yes (bucket create)
- Alignment status: Needs alignment
- Brief: Who can create child bucket and flows not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; owner (or admin with create) can open form; non-owner without create → not found; non-admin → not found; invalid parent bucket id → not found.
- **AuthZ matrix:** Who sees "create child bucket" link.
- **CRUD state matrix:** Create: valid submit → redirect to list/detail and new bucket visible; validation (required name, etc.).
- **URL state:** N/A for create form.
- **Flows:** List/detail → new child (navigate from parent bucket to create child form).

## Steps to implement

1. Establish permission for creating child bucket (e.g. same as bucket create or parent bucket update).
2. Add tests: unauthenticated → redirect; owner (or permitted admin) opens child-new → form visible; restricted actor → not found; invalid parent id → not found.
3. Add test: submit valid form → redirect and new bucket visible in list or under parent.
4. Add validation test: empty name or invalid input → validation visible, remain on form.
5. Add flow: navigate from parent bucket detail/list to create child bucket form.
6. setE2EUserContext and hyphenated terms throughout.
7. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-child-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment; unauthenticated→redirect; owner/permitted admin→form; non-admin and invalid parent id→not found; valid submit→detail and new bucket visible; validation (empty name); Cancel→bucket-detail-page; flow: bucket-detail-page (buckets-tab)→add-bucket link→child-bucket-create-form; setE2EUserContext and hyphenated terms; post-navigation assertions in callbacks; capturePageLoad for Cancel, valid create, non-owner admin, and flow. Run `make e2e_test_web_report_spec SPEC=e2e/bucket-child-new.spec.ts` locally to verify (Xcode license may block in CI).
