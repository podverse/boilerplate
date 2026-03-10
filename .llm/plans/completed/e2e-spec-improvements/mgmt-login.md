# E2E improvement: Management-web Login

## Spec path

- **Web:** N/A (see web-login.md)
- **Management-web:** `apps/management-web/e2e/login.spec.ts`

## Current state

- Permission-gated: N/A (auth only)
- Alignment status: N/A
- Brief: Redirect and credentials; ensure validation and already-logged-in redirect.

## Gaps (skills)

- **Readability:** Full-sentence titles/labels, setE2EUserContext, hyphenated terms (login-page).
- **Permission actor matrix:** N/A.
- **AuthZ matrix:** Already logged in visits /login → redirect to dashboard or home.
- **CRUD state matrix:** Invalid credentials → error visible, remain on login; valid → redirect and destination visible.
- **URL state:** returnUrl if supported (safe vs unsafe).
- **Flows:** Visit login → invalid submit → error; valid submit → dashboard.

## Steps to implement

1. Add test: invalid credentials → error message visible, still on login page.
2. Add test: valid credentials → redirect to dashboard; assert destination visible.
3. Add test: already authenticated user visits /login → redirect to dashboard.
4. If returnUrl supported, add safe/unsafe tests.
5. setE2EUserContext and hyphenated terms throughout.
6. Run targeted spec.

## Verification

- Targeted run: `make e2e_test_management_web_report_spec SPEC=e2e/login.spec.ts`
- After changes: full app E2E if touching shared helpers.

---

## Status: Completed

- **Date:** 2025-03-09
- **Done:** Step 1–3: Invalid and valid credential tests present; valid test now asserts destination visible (dashboard heading inside submit callback). Already-authenticated test: redirect and dashboard-heading assertions moved inside second actionAndCapture callback, capturePageLoad added for dashboard. Step 4: returnUrl not supported by management login (always redirects to dashboard); no tests added. Step 5: setE2EUserContext and hyphenated terms (login-page, login-form, dashboard-page) throughout; full-sentence describe. Step 6: Run `make e2e_test_management_web_report_spec SPEC=e2e/login.spec.ts` to confirm (local run blocked by Xcode license).
