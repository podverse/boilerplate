# Part 2: Signup-enabled run – Mailpit, config, make target, and spec

**Goal:** Add a second E2E run that uses `AUTH_MODE=user_signup_email` and `MAILER_ENABLED=true`, with Mailpit in Docker for real SMTP, a separate Playwright config, a make target, and a new spec file. Report goes to `web-signup-enabled/`.

**Depends on:** Part 1 (baseline) completed so default config and signup spec are already admin_only.

## 1. Mailpit in Docker (e2e_mailpit_up)

**File:** `makefiles/local/Makefile.local.e2e.mk` (or `makefiles/local/Makefile.local.test.mk`)

- Add target **`e2e_mailpit_up`**: Start Mailpit container (e.g. `axllent/mailpit` or `ghcr.io/axllent/mailpit`) on host ports **1025** (SMTP) and **8025** (web UI). Idempotent like `test_valkey_up`: if container running → no-op; if stopped → `docker start`; if missing → `docker run`. Use container name `boilerplate_e2e_mailpit` and bind to `127.0.0.1`. Optionally **`e2e_mailpit_down`** / **`e2e_mailpit_clean`** for teardown.
- Mailpit receives mail from the API so `sendVerificationEmail` succeeds; no app code changes.

## 2. Playwright config for signup-enabled run

**New file:** `apps/web/playwright.signup-enabled.config.ts`

- Copy `apps/web/playwright.config.ts` and change only the API `webServer` command to add:
  - `AUTH_MODE=user_signup_email`
  - `MAILER_ENABLED=true`
  - `SMTP_HOST=localhost` `SMTP_PORT=1025` `MAIL_FROM=test@test.com` `APP_BASE_URL=http://localhost:4010`
- Same ports (4010, 4011, 4012), same testDir and reporter; API sends into Mailpit.

## 3. New spec file: signup-enabled (user_signup_email)

**New file:** `apps/web/e2e/signup-unauthenticated-signup-enabled.spec.ts`

- Describe: "Signup page when signup is enabled (AUTH_MODE=user_signup_email, MAILER_ENABLED=true)."
- **Tests (single-outcome):**
  - When the user submits with a duplicate email (e.g. seeded `e2e-bucket-owner@example.com`), they see a duplicate-email (or validation) error and remain on the signup page. Assert text like `/already exists|duplicate|taken/i` and URL `/signup`.
  - When the user submits valid signup data, they are redirected to login or dashboard. Assert `toHaveURL(/\/(login|dashboard)/)`.
- Reuse helpers: `actionAndCapture`, `capturePageLoad`, `setE2EUserContext`, `nextFixtureName`.
- Do **not** add this file to `makefiles/local/e2e-spec-order-web.txt`; it is run only by the signup-enabled make target.

## 4. Make target e2e_test_web_signup_enabled

**File:** `makefiles/local/Makefile.local.e2e.mk`

- **New target `e2e_test_web_signup_enabled`:**
  - Deps: `e2e_run_api_gate`, `e2e_seed_web`, **`e2e_mailpit_up`** (so Mailpit is running before Playwright starts the API).
  - Run Playwright with `--config=playwright.signup-enabled.config.ts` and only `e2e/signup-unauthenticated-signup-enabled.spec.ts`.
  - Write HTML report to **`$(RUN_DIR)/web-signup-enabled/`** (separate from `web/`). Use same step reporter and env (E2E_STEP_SCREENSHOTS, PLAYWRIGHT_HTML_OUTPUT_DIR, etc.).
- Optional: target `e2e_test_web_all_modes` that runs both baseline web E2E and signup-enabled E2E and produces `web/` and `web-signup-enabled/` under the same timestamp.

## Verification

- `make e2e_mailpit_up` – Mailpit running on 1025 / 8025.
- `make e2e_test_web_signup_enabled` – Playwright runs signup-enabled spec; API sends mail to Mailpit; report in `.artifacts/e2e-reports/<ts>/web-signup-enabled/`.
