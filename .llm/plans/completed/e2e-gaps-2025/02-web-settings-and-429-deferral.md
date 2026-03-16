# 02 – Web Settings Tab/Control State and 429 Deferral

## Gap 3: Web settings tab or control state

**Issue:** The web CRUD matrix lists "Gap (tab active state + control enable/disable transitions)" for settings.

**Fix:**

- In [apps/web/e2e/settings-unauthenticated.spec.ts](apps/web/e2e/settings-unauthenticated.spec.ts) there is no authenticated settings flow; ensure an **authenticated** settings spec exists (e.g. `settings-seeded-bucket-owner.spec.ts` or similar). If it does not exist, create a minimal spec that:
  1. Logs in as a seeded user.
  2. Navigates to `/settings` or `/settings?tab=profile` (and optionally `?tab=password`).
  3. Asserts the correct tab content is visible and the URL preserves the tab param (e.g. `expect(page).toHaveURL(/\/settings\?tab=password/)` when opening the password tab).
- If an authenticated settings spec already exists, add one test that asserts **tab active state and URL**: e.g. navigate to `/settings?tab=password`, assert the password tab/content is visible and the tab link for "Password" (or equivalent) is in active/selected state; repeat for profile if applicable.

**Verification:** `make e2e_test_web_report_spec SPEC=e2e/settings-*.spec.ts` (or the relevant spec name).

---

## Gap 4: 429 / rate-limit coverage (deferral)

**Issue:** Matrices list "Gap (429/rate-limit where feasible)" for auth screens (login, signup, etc.). E2E seed and API do not currently support triggering a deterministic 429 response.

**Fix:**

- **Defer** automated 429 testing until test infrastructure supports it (e.g. API mock or rate-limit bypass for E2E).
- Add a **short comment** in one of:
  - [apps/web/e2e/login-unauthenticated.spec.ts](apps/web/e2e/login-unauthenticated.spec.ts) at the top of the describe block, or
  - This plan file (02),
  stating that 429/rate-limit handling is not asserted in E2E and is deferred until the test environment can trigger 429 deterministically.

**Verification:** No new test; comment only. Full E2E run should be unchanged.
