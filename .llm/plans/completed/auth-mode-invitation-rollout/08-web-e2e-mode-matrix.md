# 08 - Web E2E mode matrix

## Scope

Update web E2E coverage so each auth mode has deterministic, single-outcome tests for route
access, link visibility, and invitation completion behavior.

## Matrix expectations

### admin_only_username (default web config)

- Login page does not show signup link.
- Login page does not show forgot-password link.
- `/signup` is unavailable with deterministic behavior.
- `/forgot-password` and `/reset-password` unavailable with deterministic behavior.
- Invitation set-password completion flow supports username + password fields.

### admin_only_email (new web config)

- Login page does not show signup link.
- Forgot-password link is visible and functional.
- `/signup` unavailable with deterministic behavior.
- Forgot/reset flow works end-to-end in this mode.
- Invitation set-password completion requires email + username + password.

### user_signup_email (signup-enabled config)

- Login page shows signup and forgot-password links.
- `/signup` flow works with existing deterministic expectations.
- Forgot/reset flow works with existing deterministic expectations.
- Management-origin invite link creation path is absent from user creation UX expectations.

## Steps

1. Add/adjust Playwright configs to represent all three modes deterministically.
2. Split any remaining dual-outcome tests into mode-specific specs.
3. Update signup/forgot/reset unauthenticated specs for per-mode expectations.
4. Add invitation completion E2E coverage for both admin-only modes.
5. Update E2E make targets and spec-order files so baseline and mode-specific runs stay clear.

## Key files

- `apps/web/playwright.config.ts`
- `apps/web/playwright.signup-enabled.config.ts`
- `apps/web/e2e/signup-unauthenticated.spec.ts`
- `apps/web/e2e/signup-unauthenticated-signup-enabled.spec.ts`
- `apps/web/e2e/forgot-password-unauthenticated.spec.ts`
- `apps/web/e2e/forgot-password-unauthenticated-signup-enabled.spec.ts`
- `apps/web/e2e/reset-password-unauthenticated.spec.ts`
- `apps/web/e2e/reset-password-unauthenticated-signup-enabled.spec.ts`
- `apps/web/e2e/invite-unauthenticated.spec.ts`
- `makefiles/local/Makefile.local.e2e.mk`
- `makefiles/local/e2e-spec-order-web.txt`

## Acceptance criteria

- Each E2E spec has exactly one expected behavior in its mode.
- No tests rely on fallback outcomes or `Promise.race` for incompatible behaviors.
- Invitation completion is covered for both admin-only modes.
- Signup-enabled behavior remains isolated to signup-enabled test run.

## Verification

From repo root:

```bash
make e2e_test_web_report_spec SPEC=e2e/signup-unauthenticated.spec.ts,e2e/forgot-password-unauthenticated.spec.ts,e2e/reset-password-unauthenticated.spec.ts
make e2e_test_web_signup_enabled
```

When API behavior changed significantly, run with strict gate:

```bash
make E2E_API_GATE_MODE=on e2e_test_web_signup_enabled
```
