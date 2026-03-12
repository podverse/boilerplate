# auth-e2e-matrix

Started: 2026-03-11
Context: E2E auth mode matrix – fix default run, admin_only_username baseline, admin_only_email and user_signup_email specs (see .llm/plans/active/auth-e2e-matrix/).

---

### Session 1 - 2026-03-11

#### Prompt (Developer)

@boilerplate/.llm/plans/active/auth-e2e-matrix/00-fix-and-baseline.md implement plan then give me precise test commands to run afterwards

#### Key Decisions

- Step 1 (Makefile) was already implemented: `e2e_test_web` and `e2e_test` both invoke the first web run with `-- $(WEB_SPEC_ORDERED)` so only baseline specs from e2e-spec-order-web.txt run with default config (AUTH_MODE=admin_only_username).
- Step 2 verified: all six baseline auth specs (login-unauthenticated, login-bucket-owner, signup-unauthenticated, forgot-password-unauthenticated, reset-password-unauthenticated, set-password-unauthenticated) exist and are listed in makefiles/local/e2e-spec-order-web.txt at lines 7–12. Default playwright.config.ts uses AUTH_MODE=admin_only_username.
- Plan deliverables updated: baseline specs confirmed; only remaining check is user running `make e2e_test_web` to confirm both phases pass.

#### Files Created/Modified

- .llm/plans/active/auth-e2e-matrix/00-fix-and-baseline.md (deliverables updated)
- .llm/history/active/auth-e2e-matrix/auth-e2e-matrix.md (this file)

---

### Session 2 - 2026-03-11

#### Prompt (Developer)

implement @boilerplate/.llm/plans/active/auth-e2e-matrix/01-admin-only-email.md

#### Key Decisions

- Added `e2e_mailpit_up` as a dependency of `e2e_test_web_admin_only_email` so the forgot-password spec (valid email → check-your-email success) can succeed when the API sends to SMTP.
- Ran admin_only_email E2E: all 9 tests (5 spec files) passed with no selector changes. Existing selectors match app labels (forgot password link, Send reset link button, Reset token label, Email label on set-password, validation text).
- Invite: left as baseline-only per plan (optional extra spec not added).

#### Files Created/Modified

- makefiles/local/Makefile.local.e2e.mk (e2e_test_web_admin_only_email depends on e2e_mailpit_up)
- .llm/plans/active/auth-e2e-matrix/01-admin-only-email.md (deliverables marked done)
- .llm/history/active/auth-e2e-matrix/auth-e2e-matrix.md (this file)

---

### Session 3 - 2026-03-11

#### Prompt (Developer)

complete those gaps. do not run the tests during your process

#### Key Decisions

- Closed user_signup_email login gap: added `login-unauthenticated-signup-enabled.spec.ts` (signup + forgot-password links visible; click signup → /signup; click forgot-password → /forgot-password).
- Closed set-password signup-enabled run gap: added `set-password-unauthenticated-signup-enabled.spec.ts` and `login-unauthenticated-signup-enabled.spec.ts` to `SIGNUP_ENABLED_WEB_SPECS` in Makefile so the signup-enabled phase runs all five auth specs in order: login, signup, forgot-password, reset-password, set-password.

#### Files Created/Modified

- apps/web/e2e/login-unauthenticated-signup-enabled.spec.ts (new)
- makefiles/local/Makefile.local.e2e.mk (SIGNUP_ENABLED_WEB_SPECS extended with login + set-password)
- .llm/history/active/auth-e2e-matrix/auth-e2e-matrix.md (this file)

---

### Session 4 - 2026-03-11

#### Prompt (Developer)

Debug: Settings bucket-owner E2E timeout (email-change success message). Implement the plan as specified.

#### Key Decisions

- Single-outcome per test (no dual-condition): success test runs only when `E2E_EMAIL_VERIFICATION_ENABLED=1` (admin-only-email config); disabled test runs in default config and asserts "email verification is not enabled".
- Added `e2e/settings-bucket-owner.spec.ts` to admin-only-email spec order and `E2E_EMAIL_VERIFICATION_ENABLED=1` to `e2e_test_web_admin_only_email` so the email-change success test runs there with Mailpit.
- Success test uses `test.setTimeout(10_000)` to avoid flakiness with Mailpit.

#### Files Created/Modified

- apps/web/e2e/settings-bucket-owner.spec.ts (skip conditions, new disabled test)
- makefiles/local/e2e-spec-order-web-admin-only-email.txt (settings-bucket-owner added)
- makefiles/local/Makefile.local.e2e.mk (E2E_EMAIL_VERIFICATION_ENABLED=1 for admin-only-email run)
- .llm/history/active/auth-e2e-matrix/auth-e2e-matrix.md (this file)

---

### Session 5 - 2026-03-11

#### Prompt (Developer)

write the separate tests so "skipped" is not necessary. also update any skills you need to remember this requirement

#### Key Decisions

- Use separate spec files per auth mode instead of `test.skip()`: default config runs `settings-bucket-owner.spec.ts` (email-tab asserts "email verification is not enabled" only); admin-only-email config runs `settings-bucket-owner-admin-only-email.spec.ts` (same shared tests plus email-change success test). No skip in either file.
- Updated e2e-page-tests skill: policy now requires "separate spec files per mode (avoid test.skip())" so that "skipped" is not necessary; each file has a single outcome per test and runs in one config.

#### Files Created/Modified

- apps/web/e2e/settings-bucket-owner-admin-only-email.spec.ts (new; shared tests + email success test)
- apps/web/e2e/settings-bucket-owner.spec.ts (removed success test and all skip logic; kept disabled-message test only)
- makefiles/local/e2e-spec-order-web-admin-only-email.txt (settings-bucket-owner → settings-bucket-owner-admin-only-email.spec.ts)
- .cursor/skills/e2e-page-tests/SKILL.md (deterministic outcome policy: separate files per mode, avoid skip)
- .llm/history/active/auth-e2e-matrix/auth-e2e-matrix.md (this file)

---

### Session 6 - 2026-03-11

#### Prompt (Developer)

generate and save the plan files locally so it is not an overwhelming amount of work

#### Key Decisions

- Split the top-level-suite-title normalization effort into a local plan set with phased execution so work can be completed in manageable chunks.
- Saved the plan set under `.llm/plans/active/e2e-suite-title-normalization/` using the standard structure (`00-EXECUTION-ORDER`, `00-SUMMARY`, numbered plan files, and `COPY-PASTA`).
- Structured the work to enforce the rule across both `apps/web/e2e` and `apps/management-web/e2e`, including guidance/rule-memory updates as the first phase.

#### Files Created/Modified

- .llm/history/active/auth-e2e-matrix/auth-e2e-matrix.md (this file)
- .llm/plans/active/e2e-suite-title-normalization/00-EXECUTION-ORDER.md (new)
- .llm/plans/active/e2e-suite-title-normalization/00-SUMMARY.md (new)
- .llm/plans/active/e2e-suite-title-normalization/01-guidance-memory-updates.md (new)
- .llm/plans/active/e2e-suite-title-normalization/02-web-suite-title-sweep.md (new)
- .llm/plans/active/e2e-suite-title-normalization/03-management-web-suite-title-sweep.md (new)
- .llm/plans/active/e2e-suite-title-normalization/04-validation-and-report-smoke.md (new)
- .llm/plans/active/e2e-suite-title-normalization/COPY-PASTA.md (new)
