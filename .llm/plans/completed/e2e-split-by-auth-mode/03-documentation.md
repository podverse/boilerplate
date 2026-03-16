# Part 3: Documentation

**Goal:** Document that default E2E uses admin_only and that the signup-enabled run is separate (Mailpit, make target, report dir).

**Depends on:** Parts 1 and 2 completed.

## File to update

**File:** `docs/testing/E2E-PAGE-TESTING.md` (or equivalent – confirm path in repo)

- State that the **default** E2E run uses `AUTH_MODE=admin_only` (signup disabled). Baseline signup tests expect only "Registration is by admin only" / signup-disabled behavior.
- Document the **signup-enabled** run:
  - Command: `make e2e_test_web_signup_enabled`
  - When to use: when you need to verify signup-enabled flows (duplicate email error, successful signup redirect).
  - Requires Mailpit: `make e2e_mailpit_up` (or the target is a dep of `e2e_test_web_signup_enabled`).
  - Report location: `web-signup-enabled/` under the timestamped run dir (e.g. `.artifacts/e2e-reports/<ts>/web-signup-enabled/`).
- Note that tests that depend on critical env (AUTH_MODE, MAILER_ENABLED) have **separate specs and reports** so each mode is tested with single-outcome expectations (no dual-outcome tests).

## Optional

- Add a short "E2E and AUTH_MODE" or "Signup-enabled E2E" subsection if the doc is long.
- If `make help` or similar lists E2E targets, ensure `e2e_test_web_signup_enabled` and optionally `e2e_mailpit_up` are mentioned.
