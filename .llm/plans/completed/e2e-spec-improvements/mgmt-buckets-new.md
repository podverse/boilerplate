# E2E improvement: Management-web Buckets new

## Spec path

- **Web:** N/A (see web-buckets-new.md)
- **Management-web:** `apps/management-web/e2e/buckets-new.spec.ts`

## Current state

- Permission-gated: Yes (bucket create)
- Alignment status: Partial
- Brief: Management role for create; may need role matrix and validation.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with bucket create → form; admin without → not found.
- **AuthZ matrix:** Who sees "add bucket" on buckets list.
- **CRUD state matrix:** Create bucket: valid submit → list shows new bucket; validation (required name, owner).
- **URL state:** N/A.
- **Flows:** Buckets list → new bucket form.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens new bucket form → form; restricted → not found.
2. Add create success test and validation test.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/buckets-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, permitted (super-admin) opens buckets-new→form visible, flow buckets-list→add-bucket link→new-bucket form, validation (empty submit→validation visible), create success→redirect and new bucket visible, Cancel→buckets-list. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Restricted→redirect to buckets (app redirects, not notFound) deferred until limited-admin seeded.
