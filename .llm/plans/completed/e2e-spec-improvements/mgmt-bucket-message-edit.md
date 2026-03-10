# E2E improvement: Management-web Bucket message edit

## Spec path

- **Web:** N/A (see web-bucket-message-edit.md)
- **Management-web:** `apps/management-web/e2e/bucket-message-edit.spec.ts`

## Current state

- Permission-gated: Yes (message CRUD)
- Alignment status: Needs alignment
- Brief: Management permission for message update and actor matrix missing.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; super-admin or role with message update → form; admin without → not found; invalid message id → not found; list→edit, Cancel→list, Save→list.
- **AuthZ matrix:** Edit link visibility by role in messages list.
- **CRUD state matrix:** Update message and persistence.
- **URL state:** N/A.
- **Flows:** list→edit, Cancel→list, Save→list.

## Steps to implement

1. Establish management permission for message update.
2. Add tests: unauthenticated → redirect; permitted role opens message edit → form; restricted → not found; invalid id → not found.
3. Add flow tests: messages list → edit; Cancel → list; Save → list and persistence.
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/bucket-message-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Implemented all steps: unauthenticated→redirect, invalid message id→not found, permitted (super-admin) opens edit→form, list→edit flow, Cancel→bucket-view, Save→bucket-view and persistence (updated body visible on messages tab). Uses setE2EUserContext, hyphenated terms, actionAndCapture/capturePageLoad. Restricted-role→not found deferred (no limited-admin seeded). Added createBucketMessageFixture (with cookie forwarding) and getCookieHeaderFromPage in advancedFixtures.
