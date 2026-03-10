# E2E improvement: Web Bucket detail

## Spec path

- **Web:** `apps/web/e2e/bucket-detail.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-detail.md)

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Partial
- Brief: Likely unauthenticated redirect and one role; detail and action gating by actor not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; owner sees detail and actions; non-owner admin with access sees detail (actions may differ); non-admin → not found; invalid bucket id → not found.
- **AuthZ matrix:** Visibility of settings/edit/messages links or buttons by role.
- **CRUD state matrix:** Read (detail content visible); no create/update/delete on this page (links to other pages).
- **URL state:** N/A unless detail has tabs/query.
- **Flows:** Optional: from buckets list to detail.

## Steps to implement

1. Add tests: unauthenticated → redirect; owner opens bucket detail → heading/content and expected links visible; non-owner with access → detail visible, assert action visibility; non-admin → not found.
2. Add test: invalid bucket id → not found (for one privileged actor).
3. Assert visibility of settings, messages, or other CTAs by role (visible vs not rendered).
4. setE2EUserContext and hyphenated terms throughout.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-detail.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Steps 1–3: Tests present (unauthenticated redirect, owner and non-owner see detail and settings/messages links, invalid bucket id, non-admin not found). Post-navigation: owner test assertions (URL, bucket name, links) moved inside actionAndCapture callback; non-owner admin test has capturePageLoad. Step 4: setE2EUserContext and hyphenated terms (bucket-detail-page); full-sentence describe. Step 5: Run `make e2e_test_web_report_spec SPEC=e2e/bucket-detail.spec.ts` to confirm (local run blocked by Xcode license). **Skipped:** Optional list→detail flow.
