# E2E improvement: Web Login

## Spec path

- **Web:** `apps/web/e2e/login.spec.ts`
- **Management-web:** N/A (see mgmt-login.md)

## Current state

- Permission-gated: N/A (auth only)
- Alignment status: N/A
- Brief: Login form visible; valid credentials → dashboard; add validation, returnUrl, already-logged-in redirect.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (login-page).
- **Permission actor matrix:** N/A.
- **AuthZ matrix:** Already-logged-in user visits /login → redirect to dashboard or home (per product).
- **CRUD state matrix:** Invalid credentials → error message visible, remain on login; valid → redirect and destination visible.
- **URL state:** returnUrl param: after login, redirect to returnUrl when safe; unsafe returnUrl → redirect to dashboard.
- **Flows:** Visit login → submit invalid → error; submit valid → dashboard.

## Steps to implement

1. Add test: invalid credentials → error message visible, still on login page; setE2EUserContext.
2. Add test: valid credentials → redirect to dashboard (or default); assert destination visible.
3. Add test: already authenticated user visits /login → redirect to dashboard (or home).
4. If product supports returnUrl: add test with safe returnUrl and assert redirect; add test with unsafe returnUrl (e.g. external) → redirect to dashboard.
5. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_web_report_spec SPEC=e2e/login.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1–4 already covered. Implemented: (1) Invalid-credentials test unchanged (setE2EUserContext, error visible in callback). (2) Valid-credentials: added destination-visible assertion (dashboard heading) before capturePageLoad. (3) Already-authenticated: moved redirect and dashboard-heading assertions inside actionAndCapture callback, added capturePageLoad for dashboard. (4) returnUrl: safe test—added settings heading visible and capturePageLoad; unsafe test—added dashboard heading visible and capturePageLoad. (5) Readability: full-sentence describe, hyphenated terms throughout (login-page, login-form, sign-up-page, forgot-password-page, settings-page). Run `make e2e_test_web_report_spec SPEC=e2e/login.spec.ts` to confirm (local run blocked by Xcode license).
