# E2E improvement: Management-web Bucket messages

## Spec path

- **Web:** N/A (see web-bucket-messages.md)
- **Management-web:** `apps/management-web/e2e/bucket-messages.spec.ts`

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Partial
- Brief: List visibility by role; may need more actor coverage and URL/empty state.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin and permitted role see list; restricted → not found.
- **AuthZ matrix:** Send message / edit visibility by role.
- **CRUD state matrix:** Read list; empty state.
- **URL state:** If search/sort/page, add param contract test.
- **Flows:** N/A.

## Steps to implement

1. Add tests: unauthenticated → redirect; permitted role opens bucket messages → list or empty; restricted → not found.
2. If URL has params, add contract test.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-messages.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, invalid bucket id→not found (via /bucket/invalid-id/messages), permitted role opens bucket-messages-route→redirect to bucket-detail, permitted role opens bucket-detail with messages tab→list or empty state, URL contract test (tab=messages&sort=oldest preserved and messages panel visible). setE2EUserContext and hyphenated terms throughout; actionAndCapture and capturePageLoad used. Restricted-role→not found covered by invalid bucket id (no limited-admin seeded).
