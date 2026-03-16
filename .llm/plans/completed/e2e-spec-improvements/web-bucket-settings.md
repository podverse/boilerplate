# E2E improvement: Web Bucket settings

## Spec path

- **Web:** `apps/web/e2e/bucket-settings.spec.ts`
- **Management-web:** N/A (see mgmt-bucket-settings.md)

## Current state

- Permission-gated: Yes (bucket access)
- Alignment status: Needs alignment
- Brief: Likely minimal; tab access and admins/roles visibility by actor not fully covered.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (bucket-settings-page, etc.).
- **Permission actor matrix:** Unauthenticated → redirect; owner vs non-owner-admin (with/without bucket update or admins/roles) → which tabs visible; non-admin → not found or no settings.
- **AuthZ matrix:** Tab visibility and link visibility by role (admins tab, roles tab).
- **CRUD state matrix:** Read of settings; optional save persistence across tabs if applicable.
- **URL state:** Tab query param (?tab=admins, ?tab=roles) preserved and applied.
- **Flows:** Navigate to settings; switch tabs and assert URL and content.

## Steps to implement

1. Define permission policy for bucket settings and each tab (e.g. admins tab requires bucket-admins or bucket update).
2. Add tests: unauthenticated → redirect; owner opens settings → tabs visible per policy; non-owner with permission → allowed tabs; non-owner without → not found or limited tabs; non-admin → not found.
3. Add URL state test: open settings with ?tab=admins (and ?tab=roles), assert param preserved and correct tab content visible.
4. Add post-navigation verification after every goto/tab click.
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/bucket-settings.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Documented permission (bucket access; owner and non-owner with bucket update see settings and tabs). Step 2: Tests present (unauthenticated redirect, owner opens settings, non-owner with permission, non-admin; non-owner without skipped). Step 3: URL state—tab=roles and tab=admins tests with param preserved and content visible; assertions moved inside actionAndCapture callbacks; capturePageLoad added for both. Step 4: Post-navigation verification—owner open and tab tests now assert URL/content inside callbacks before capture; non-owner-admin test has capturePageLoad. Step 5: setE2EUserContext and hyphenated terms (bucket-settings-page, admins-tab, roles-tab); full-sentence describe. Step 6: Run `make e2e_test_web_report_spec SPEC=e2e/bucket-settings.spec.ts` to confirm (local run blocked by Xcode license). Non-owner-without-permission test remains skipped.
