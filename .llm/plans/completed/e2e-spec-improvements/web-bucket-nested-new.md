# E2E improvement: Web Bucket nested new

## Spec path

- **Web:** `apps/web/e2e/bucket-nested-new.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-child-new.md for management equivalent)

## Current state

- Permission-gated: Yes (bucket create)
- Alignment status: Needs alignment
- Brief: Same as bucket-child-new; who can create nested bucket and flows.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; permitted user can open form; restricted → not found; invalid parent id → not found.
- **AuthZ matrix:** Who sees create nested bucket link.
- **CRUD state matrix:** Create path with validation and post-create visibility.
- **URL state:** N/A.
- **Flows:** Navigate from parent context to nested-new form.

## Steps to implement

1. Align with bucket-child-new permission model (nested vs child may share policy).
2. Add tests: unauthenticated → redirect; permitted actor → form; restricted → not found; invalid parent → not found.
3. Add create success and validation tests.
4. Add flow: list/detail → nested-new.
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-nested-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Permission comment (align with bucket-child-new); unauthenticated→redirect; owner and non-owner admin with permission→form; non-admin and invalid parent id→not found; valid submit→bucket-detail and new bucket visible; validation (empty name); Cancel→bucket-detail; flow: bucket-detail-page (buckets-tab)→navigate to nested-bucket-create-page→form visible; setE2EUserContext and hyphenated terms; post-navigation assertions in callbacks; capturePageLoad for owner form, Cancel, valid create, flow, non-owner admin. Run `make e2e_test_web_report_spec SPEC=e2e/bucket-nested-new.spec.ts` locally to verify (Xcode license may block in CI).
