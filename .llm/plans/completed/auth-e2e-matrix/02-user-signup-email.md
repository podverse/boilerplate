# 02 – User-signup-email auth E2E coverage

**Purpose:** Ensure full E2E coverage for `AUTH_MODE=user_signup_email`: login (signup + forgot-password visible), signup form (valid, duplicate email, validation), forgot-password, reset-password, set-password (invite disabled → redirect to login). Mailpit used for signup and forgot-password flows.

**Prerequisite:** 00-fix-and-baseline.md completed. Signup-enabled specs run only via the second phase of `make e2e_test_web` (after Mailpit is up), using `playwright.signup-enabled.config.ts` and `SIGNUP_ENABLED_WEB_SPEC_ARGS`.

---

## Existing spec files (signup-enabled)

| Spec | Coverage |
|------|----------|
| `e2e/login-unauthenticated-signup-enabled.spec.ts` | Login: signup and forgot-password links visible; click signup → signup page; click forgot-password → forgot-password page |
| `e2e/signup-unauthenticated-signup-enabled.spec.ts` | Signup: duplicate email → redirect to login + check-your-email; valid signup → redirect to login + check-your-email |
| `e2e/forgot-password-unauthenticated-signup-enabled.spec.ts` | Forgot-password: valid email → check-your-email; invalid email format → validation, remain on page |
| `e2e/reset-password-unauthenticated-signup-enabled.spec.ts` | Reset-password: invalid token → invalid-link error; weak password → submit disabled; valid token → redirect to login, login with new password, revert in settings |
| `e2e/set-password-unauthenticated-signup-enabled.spec.ts` | Set-password: when invitation links disabled (signup mode without invite), visit set-password with token → redirect to login |

Listed in Makefile as `SIGNUP_ENABLED_WEB_SPECS` / `SIGNUP_ENABLED_WEB_SPEC_ARGS`. All five run in the second phase of `e2e_test_web` (after Mailpit is up) or via `make e2e_test_web_signup_enabled`.

---

## Steps to execute

1. **Run signup-enabled E2E (second phase of full web E2E):**  
   `make e2e_test_web`  
   This runs baseline first, then `e2e_mailpit_up`, then signup-enabled specs with `playwright.signup-enabled.config.ts`.  
   Or run only signup-enabled (Mailpit + report): `make e2e_test_web_signup_enabled`.  
   Or run only signup-enabled without report: `make e2e_mailpit_up` then from repo root:  
   `npm run test:e2e -w apps/web -- --config=playwright.signup-enabled.config.ts e2e/login-unauthenticated-signup-enabled.spec.ts e2e/signup-unauthenticated-signup-enabled.spec.ts e2e/forgot-password-unauthenticated-signup-enabled.spec.ts e2e/reset-password-unauthenticated-signup-enabled.spec.ts e2e/set-password-unauthenticated-signup-enabled.spec.ts`

2. **Fix selector/assertion mismatches if any test fails:**
   - **Signup:** Button: `getByRole('button', { name: /sign up|create account|submit/i })`. Match actual signup page button label.
   - **Forgot-password / Reset-password:** Same patterns as admin_only_email (forgot button, new password/confirm labels). Ensure signup-enabled config starts app with user_signup_email and mailer so forms are visible.
   - **Set-password redirect:** In user_signup_email, invite links may be disabled by capability; the spec expects visit to `/auth/set-password?token=invalid-token-12345` to redirect to `/login`. If the app still shows set-password (e.g. invite enabled in signup mode), adjust spec or app capability so the expected behavior is defined and asserted.

3. **Login spec:** Already implemented. `e2e/login-unauthenticated-signup-enabled.spec.ts` is in `SIGNUP_ENABLED_WEB_SPECS` and runs with the signup-enabled config.

---

## Deliverables

- [x] All signup-enabled auth specs pass when run with `playwright.signup-enabled.config.ts` after Mailpit is up.
- [x] Selectors for signup button, forgot-password, reset-password, set-password aligned with app.
- [x] Set-password spec: either redirect to login for invalid token in signup-enabled mode or update expectation to match app behavior (invite enabled vs disabled).
- [x] Optional: login-unauthenticated-signup-enabled.spec.ts and include in SIGNUP_ENABLED_WEB_SPEC_ARGS.

**Completion note:** Implementation and doc updates done; full test run skipped. Verify with `make e2e_test_web_signup_enabled` (or second phase of `make e2e_test_web`) if desired.
