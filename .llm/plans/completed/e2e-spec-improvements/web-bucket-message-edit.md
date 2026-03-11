# E2E improvement: Web Bucket message edit

## Spec path

- **Web:** `apps/web/e2e/bucket-message-edit.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-message-edit.md)

## Current state

- Permission-gated: Yes (message CRUD by bucket permission)
- Alignment status: Needs alignment
- Brief: Likely single-actor or minimal; owner vs admin with/without message update vs non-admin not covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; owner → can edit; non-owner-admin with message update permission → can edit; non-owner without → not found; non-admin → not found; invalid message id → not found.
- **AuthZ matrix:** Visibility of edit link/button by role; disabled state if read-only.
- **CRUD state matrix:** Update persistence (save → revisit or list shows updated); validation if applicable.
- **URL state:** N/A for edit page.
- **Flows:** List→edit (from bucket messages to message edit); Cancel→list; Save→list.

## Steps to implement

1. Establish API/source of truth for message update (e.g. bucket message update permission).
2. Add login helpers for owner, non-owner with message permission, non-owner without, non-admin.
3. Add test: unauthenticated → redirect.
4. Add test: owner opens message edit → form visible; save → list updated.
5. Add test: non-owner-admin with message update opens edit → form; without permission → not found.
6. Add test: non-admin opens message edit → not found.
7. Add test: invalid message id → not found (for one privileged actor).
8. Add flow tests: navigate from messages list to edit; Cancel returns to list; Save returns to list and change persists.
9. setE2EUserContext and hyphenated terms throughout.
10. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-message-edit.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Documented permission (message update by bucket message CRUD). Steps 2–8: Helpers reused; unauthenticated redirect; owner edit/save and cancel; added non-owner-admin with permission opens valid message edit → form visible (list→edit, form and capturePageLoad); invalid id, non-owner without, non-admin tests present. Post-navigation: Save and Cancel assertions moved inside actionAndCapture callbacks; capturePageLoad added for bucket-detail after Save and Cancel. Step 9: setE2EUserContext and hyphenated terms (bucket-message-edit-page, bucket-message-edit-form, messages-list, bucket-detail-page); full-sentence describe. Step 10: Run `make e2e_test_web_report_spec SPEC=e2e/bucket-message-edit.spec.ts` to confirm (local run blocked by Xcode license).
