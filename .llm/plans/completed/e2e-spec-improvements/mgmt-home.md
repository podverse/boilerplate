# E2E improvement: Management-web Home

## Spec path

- **Web:** N/A (see web-home.md)
- **Management-web:** `apps/management-web/e2e/home.spec.ts`

## Current state

- Permission-gated: Partial (public/auth)
- Alignment status: Partial
- Brief: Unauthenticated vs authenticated content.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (home-page, login-page).
- **Permission actor matrix:** Unauthenticated visit / → redirect to login (or landing); authenticated visit / → redirect to dashboard or home content.
- **AuthZ matrix:** N/A.
- **CRUD state matrix:** N/A (landing).
- **URL state:** N/A.
- **Flows:** Visit / unauthenticated → login; visit / authenticated → dashboard or home.

## Steps to implement

1. Add test: unauthenticated visit home → redirect to login; assert login page visible.
2. If product has authenticated home content, add test: authenticated visit home → expected content or redirect to dashboard.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/home.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Unauthenticated test—redirect and login-page visibility (URL, textbox, button) asserted inside actionAndCapture callback so screenshot is after verification. Step 2: Added authenticated visit home → redirect to dashboard test (loginAsManagementSuperAdmin, goto /, assert /dashboard and dashboard heading, capturePageLoad). Step 3: setE2EUserContext and hyphenated terms (home-page, login-page) throughout; full-sentence describe. Step 4: Run `make e2e_test_management_web_report_spec SPEC=e2e/home.spec.ts` to confirm (local run blocked by Xcode license).
