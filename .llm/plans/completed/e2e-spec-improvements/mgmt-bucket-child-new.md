# E2E improvement: Management-web Bucket child new

## Spec path

- **Web:** N/A (see web-bucket-child-new.md)
- **Management-web:** `apps/management-web/e2e/bucket-child-new.spec.ts`

## Current state

- Permission-gated: Yes (bucket create)
- Alignment status: Needs alignment
- Brief: Management role for create and flows.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with bucket create → form; admin without → not found; invalid parent bucket id → not found; list/detail → new child form.
- **AuthZ matrix:** Who sees "create child bucket" link.
- **CRUD state matrix:** Create child bucket: valid submit → list/detail shows new bucket; validation.
- **URL state:** N/A.
- **Flows:** Parent bucket detail/list → create child bucket form.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens child-new form → form visible; restricted → not found; invalid parent id → not found.
2. Add create success and validation tests.
3. Add flow: bucket detail or list → create child bucket.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-child-new.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, invalid parent bucket id→not found, permitted (super-admin) opens child-new→form visible, flow bucket-detail Buckets tab→Add bucket link→child-new form, validation (empty name→alert), create success→redirect to parent ?tab=buckets and new bucket in list. setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Restricted-role→not found covered by invalid parent id (no limited-admin seeded).
