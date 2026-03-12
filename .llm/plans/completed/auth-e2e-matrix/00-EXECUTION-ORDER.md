# Auth E2E matrix – execution order

Implement these plans in order. Each part can be verified before moving to the next.

1. ~~**00-fix-and-baseline.md**~~ – Done (moved to `.llm/plans/completed/auth-e2e-matrix/`).
2. ~~**01-admin-only-email.md**~~ – Done (moved to `.llm/plans/completed/auth-e2e-matrix/`).
3. ~~**02-user-signup-email.md**~~ – Done (moved to `.llm/plans/completed/auth-e2e-matrix/`). Test run skipped; verify with `make e2e_test_web_signup_enabled` if desired.
4. ~~**03-settings-and-invite.md**~~ – Done (moved to `.llm/plans/completed/auth-e2e-matrix/`). Test run skipped; verify with `make e2e_test_web` if desired.

**Goal:** Default E2E run no longer runs mode-specific specs with the wrong config; full auth E2E coverage for admin_only_username (baseline), admin_only_email, and user_signup_email.
