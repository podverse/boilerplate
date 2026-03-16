# E2E improvement: Management-web Dashboard

## Spec path

- **Web:** N/A (see web-dashboard.md)
- **Management-web:** `apps/management-web/e2e/dashboard.spec.ts`

## Current state

- Permission-gated: N/A (auth only)
- Alignment status: Partial
- Brief: Unauthenticated redirect; post-login content.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (dashboard-page).
- **Permission actor matrix:** Unauthenticated → redirect to login; authenticated → dashboard visible.
- **AuthZ matrix:** N/A.
- **CRUD state matrix:** Read (dashboard content — links, summaries).
- **URL state:** N/A.
- **Flows:** Login → dashboard; unauthenticated visit /dashboard → login.

## Steps to implement

1. Add test: unauthenticated user visits dashboard → redirect to login; assert login page visible.
2. Add test: authenticated user visits dashboard → dashboard heading or primary content visible.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/dashboard.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Unauthenticated test—wrapped goto and redirect/login-page assertions (URL, textbox, button) in actionAndCapture so screenshot is after verification. Step 2: Authenticated test—moved toHaveURL and dashboard-heading assertions inside the submit actionAndCapture callback (post-navigation verification before capture). Step 3: setE2EUserContext and hyphenated terms (dashboard-page, login-page, login-form) throughout; full-sentence describe. Step 4: Run `make e2e_test_management_web_report_spec SPEC=e2e/dashboard.spec.ts` to confirm (local run blocked by Xcode license).
