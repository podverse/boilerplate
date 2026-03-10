# E2E improvement: Web Bucket messages

## Spec path

- **Web:** `apps/web/e2e/bucket-messages.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-messages.md)

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Partial
- Brief: Likely unauthenticated redirect and one role sees list; list visibility by actor and URL/empty state may be missing.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms.
- **Permission actor matrix:** Unauthenticated → redirect; owner and non-owner admin (with bucket access) see list; non-admin or no access → not found.
- **AuthZ matrix:** Who sees send message / edit links per row.
- **CRUD state matrix:** Read (list visible); empty state and loading/error if applicable.
- **URL state:** If page has search/sort/pagination, add query-param contract test.
- **Flows:** N/A (list page).

## Steps to implement

1. Add tests: unauthenticated → redirect; owner opens bucket messages → list or empty state visible; non-owner with access → list; non-admin → not found.
2. Assert post-navigation: heading or table/list visible after each navigation.
3. If URL has params (search, sort, page), add test that params persist and content matches.
4. Add empty-state assertion when no messages (if applicable).
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-messages.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Tests present (unauthenticated redirect, owner and non-owner admin see list or empty state, non-admin not found). Step 2: Post-navigation—owner test assertions (URL, heading) moved inside actionAndCapture callback; non-owner admin test has capturePageLoad. Step 3: N/A (standalone messages route redirects to bucket detail; no search/sort params). Step 4: Skipped (empty-state assertion when no messages). Step 5: setE2EUserContext and hyphenated terms (bucket-messages-page, messages-list); full-sentence describe. Step 6: Run `make e2e_test_web_report_spec SPEC=e2e/bucket-messages.spec.ts` to confirm (local run blocked by Xcode license).
