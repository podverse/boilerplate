# E2E improvement: Web Home

## Spec path

- **Web:** `apps/web/e2e/home.spec.ts`
- **Management-web:** N/A (see mgmt-home.md)

## Current state

- Permission-gated: Partial (public/auth)
- Alignment status: Partial
- Brief: Unauthenticated redirect to login; unauthenticated vs authenticated content and readability.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (home-page, login-page).
- **Permission actor matrix:** Unauthenticated visit / → redirect to login (or show landing); authenticated visit / → redirect to dashboard or show home content.
- **AuthZ matrix:** N/A.
- **CRUD state matrix:** N/A (landing).
- **URL state:** N/A.
- **Flows:** Visit / unauthenticated → login; visit / authenticated → dashboard or home content.

## Steps to implement

1. Add test: unauthenticated visit home → redirect to login; assert login page visible (destination verification).
2. If product has authenticated home content, add test: authenticated visit home → expected content or redirect to dashboard.
3. setE2EUserContext and hyphenated terms throughout.
4. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/home.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1: Unauthenticated visit home → redirect to login; assertions (toHaveURL, login button visible) moved inside actionAndCapture callback so screenshot is after verification. Step 2: Added authenticated visit home → redirect to dashboard test (login, goto /, assert /dashboard and dashboard heading). Step 3: setE2EUserContext and hyphenated terms (home-page, login-page) throughout; describe and titles use full sentences. Step 4: Targeted run requested; run `make e2e_test_web_report_spec SPEC=e2e/home.spec.ts` to confirm (local run was blocked by Xcode license).
