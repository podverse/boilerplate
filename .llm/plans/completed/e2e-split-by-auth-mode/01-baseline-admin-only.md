# Part 1: Baseline (admin_only) – config and signup spec

**Goal:** Default E2E run uses `AUTH_MODE=admin_only`; signup spec contains only single-outcome tests (no "either duplicate-email or Registration is by admin only").

## 1. Baseline Playwright config (admin_only)

**File:** `apps/web/playwright.config.ts`

- In the API `webServer` command, add explicit env so the default run is deterministic:
  - `AUTH_MODE=admin_only`
  - Leave `MAILER_ENABLED` unset (or empty) so verification routes remain disabled for baseline.
- This makes the default E2E run always "signup disabled"; no reliance on repo `.env`.

## 2. Baseline signup spec: single-outcome only (admin_only)

**File:** `apps/web/e2e/signup-unauthenticated.spec.ts`

- **Duplicate-email–style test:** Replace with a single-outcome test: "When the user submits the signup form while signup is disabled (admin_only), they see 'Registration is by admin only' and remain on the signup page." Same flow (e.g. fill duplicate email and submit). Assert only the admin_only message (e.g. `getByText(/registration is by admin only/i)`) and `toHaveURL(/\/signup/)`. Remove the regex that accepts "already exists|duplicate|...".
- **Valid signup test:** Replace dual outcome with single outcome: "When the user submits valid signup data while signup is disabled, they see 'Registration is by admin only' and remain on the signup page." Assert the admin_only message and no redirect to login/dashboard. Remove `Promise.race` and the branch that expects redirect.
- Keep all other tests as-is (form visible, invalid email, weak password, empty required fields, log-in link); they are already single-outcome and valid for admin_only.

Result: This file is the **baseline signup spec** for `AUTH_MODE=admin_only` only; every test has one expected result.

## 3. Spec order and exclusion

**File:** `makefiles/local/e2e-spec-order-web.txt`

- Do **not** add any new signup-enabled spec to this list. The baseline full report must only run admin_only specs. (The signup-enabled spec will be added in Part 2 and run only via a separate make target.)

## Verification

- Run `make e2e_test_web_report_spec SPEC=e2e/signup-unauthenticated.spec.ts` (or full `make e2e_test_web`) and confirm all signup tests pass with single-outcome assertions.
- Default E2E run must not depend on repo `.env` for AUTH_MODE; the config supplies `AUTH_MODE=admin_only`.
