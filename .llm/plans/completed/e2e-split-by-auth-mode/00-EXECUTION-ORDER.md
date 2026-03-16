# E2E split by AUTH_MODE – Execution order

Implement these plans in order. Each part can be verified before moving to the next.

1. **01-baseline-admin-only.md** – Default E2E run uses `AUTH_MODE=admin_only`; signup spec has single-outcome tests only.
2. **02-signup-enabled-mailpit-and-spec.md** – Mailpit in Docker, signup-enabled Playwright config, make target, and new signup-enabled spec file.
3. **03-documentation.md** – Update E2E testing docs for baseline vs signup-enabled runs.

**Goal (all parts):** No dual-outcome signup tests; baseline = admin_only; separate run and report for user_signup_email + MAILER_ENABLED with Mailpit.

**Note:** The three-mode E2E matrix (admin_only_username, admin_only_email, user_signup_email) and related configs/specs are defined in the completed **auth-mode-invitation-rollout** plan set.
