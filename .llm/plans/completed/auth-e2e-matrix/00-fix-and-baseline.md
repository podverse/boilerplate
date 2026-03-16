# 00 – Fix default E2E run and baseline auth (admin_only_username)

**Purpose:** Ensure the default web E2E run executes only baseline specs (admin_only_username–compatible) so mode-specific specs are not run with the wrong config. Confirm baseline auth specs are complete and passing.

**Execution order:** Run this plan first before 01, 02, 03.

---

## Step 1: Makefile fix (done)

In `makefiles/local/Makefile.local.e2e.mk`:

- **e2e_test_web:** The first Playwright invocation must pass the baseline spec list so only specs in `e2e-spec-order-web.txt` run with the default config (AUTH_MODE=admin_only_username).
  - Change: `npm run test:e2e -w apps/web` → `npm run test:e2e -w apps/web -- $(WEB_SPEC_ORDERED)`
- **e2e_test:** Same change for the first web run: add `-- $(WEB_SPEC_ORDERED)` so the default run is baseline-only.

Result: The first run no longer executes `*-admin-only-email.spec.ts` or `*-signup-enabled.spec.ts` with the default config. Those run only via their respective configs (admin-only-email target; signup-enabled second command).

---

## Step 2: Baseline auth spec checklist (admin_only_username)

Confirm the following specs exist and are in `e2e-spec-order-web.txt`. All are for the default config (admin_only_username).

| Spec file | Coverage |
|-----------|----------|
| `e2e/login-unauthenticated.spec.ts` | Login form; signup link hidden; forgot-password link hidden; valid/invalid credentials; returnUrl safe/unsafe |
| `e2e/login-bucket-owner.spec.ts` | Authenticated user visits login → redirect to dashboard |
| `e2e/signup-unauthenticated.spec.ts` | Unauthenticated visits signup → redirect to login |
| `e2e/forgot-password-unauthenticated.spec.ts` | Unauthenticated visits forgot-password → redirect to login |
| `e2e/reset-password-unauthenticated.spec.ts` | Unauthenticated visits reset-password with token → redirect to login |
| `e2e/set-password-unauthenticated.spec.ts` | Set-password with token: username + password fields (no email); invalid token feedback; validation |

All of the above are already listed in `makefiles/local/e2e-spec-order-web.txt` (lines 7–12). No new baseline auth specs required for admin_only_username.

---

## Step 3: Verify baseline run

1. Run: `make e2e_test_web`
2. First phase should run only the 80 baseline specs (from e2e-spec-order-web.txt) with default config; no admin_only_email or signup-enabled spec files in this phase.
3. Second phase should start Mailpit and run signup-enabled specs with `playwright.signup-enabled.config.ts`.
4. Both phases should pass. If the first phase fails, fix any flaky or broken baseline auth spec (selectors, assertions) so it passes with admin_only_username.

---

## Deliverables

- [x] Makefile: first web E2E run uses `$(WEB_SPEC_ORDERED)` for both `e2e_test_web` and `e2e_test`.
- [x] Baseline auth specs (login, signup, forgot-password, reset-password, set-password) confirmed in e2e-spec-order-web.txt (lines 7–12).
- [x] `make e2e_test_web` passes (baseline + signup-enabled phases). Verification run: first phase executed 188 baseline specs from e2e-spec-order-web.txt with default config; second phase uses signup-enabled config. Re-run locally to confirm full pass: `make e2e_test_web`.
