# e2e-split-by-auth-mode

Started: 2025-03-11
Context: E2E split by AUTH_MODE – baseline admin_only, then signup-enabled run with Mailpit (see .llm/plans/active/e2e-split-by-auth-mode/).

---

### Session 1 - 2025-03-11

#### Prompt (Developer)

implement @boilerplate/.llm/plans/active/e2e-split-by-auth-mode/01-baseline-admin-only.md

#### Key Decisions

- Baseline Playwright config: added `AUTH_MODE=admin_only` to API webServer command so default E2E run is deterministic and does not rely on repo `.env`.
- Signup spec: both "duplicate email" and "valid signup" tests now assert single outcome for admin_only only (message "Registration is by admin only" and remain on /signup). Removed dual-outcome regex and Promise.race.
- Spec order: no change to e2e-spec-order-web.txt (Part 1 says do not add signup-enabled spec; that spec is added in Part 2).

#### Files Modified

- apps/web/playwright.config.ts (AUTH_MODE=admin_only in API command)
- apps/web/e2e/signup-unauthenticated.spec.ts (single-outcome tests for admin_only)
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)

---

### Session 2 - 2025-03-10

#### Prompt (Developer)

implement @boilerplate/.llm/plans/active/e2e-split-by-auth-mode/02-signup-enabled-mailpit-and-spec.md

#### Key Decisions

- Mailpit: idempotent `e2e_mailpit_up` (running → no-op; stopped → docker start; else docker run) on 127.0.0.1:1025 (SMTP) and 8025 (web UI); container name `boilerplate_e2e_mailpit`. Added `e2e_mailpit_down` and `e2e_mailpit_clean`.
- Signup-enabled Playwright config: `playwright.signup-enabled.config.ts` in apps/web with API command using `AUTH_MODE=user_signup_email`, `MAILER_ENABLED=true`, `SMTP_HOST=localhost`, `SMTP_PORT=1025`, `MAIL_FROM=test@test.com`, `APP_BASE_URL=http://localhost:4010`; same ports 4010/4011/4012.
- New spec `signup-unauthenticated-signup-enabled.spec.ts`: two tests—duplicate email (e2e-bucket-owner@example.com) shows error and stays on /signup; valid signup redirects to /login or /dashboard. Reuses actionAndCapture, capturePageLoad, setE2EUserContext, nextFixtureName. Not added to e2e-spec-order-web.txt.
- Make target `e2e_test_web_signup_enabled`: deps e2e_run_api_gate, e2e_seed_web, e2e_mailpit_up; runs Playwright with signup-enabled config and single spec; report to `$(RUN_DIR)/web-signup-enabled/`; same step reporter and rotation as e2e_test_web_report_spec.

#### Files Created/Modified

- makefiles/local/Makefile.local.e2e.mk (e2e_mailpit_up/down/clean, e2e_test_web_signup_enabled)
- apps/web/playwright.signup-enabled.config.ts (new)
- apps/web/e2e/signup-unauthenticated-signup-enabled.spec.ts (new)
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)

---

### Session 3 - 2025-03-10

#### Prompt (Developer)

implmenet @boilerplate/.llm/plans/active/e2e-split-by-auth-mode/03-documentation.md and make sure skills are updated if needed

#### Key Decisions

- E2E-PAGE-TESTING.md: Added Make targets table rows for e2e_mailpit_up/down/clean and e2e_test_web_signup_enabled; added "E2E and AUTH_MODE (signup-enabled run)" subsection (default admin_only, separate specs/reports, signup-enabled command/Mailpit/report dir); added web-signup-enabled to timestamped report output section.
- e2e-page-tests skill: Documented default AUTH_MODE=admin_only and signup-enabled config/target; added signup-enabled row to config table and Quick reference; bumped version to 1.3.0.
- response-ending-make-verify skill: Added "Signup-enabled web flows" to command decision tree (make e2e_test_web_signup_enabled); bumped version to 1.1.0.
- No root make help target; doc table is the canonical E2E target list.

#### Files Modified

- docs/testing/E2E-PAGE-TESTING.md
- .cursor/skills/e2e-page-tests/SKILL.md
- .cursor/skills/response-ending-make-verify/SKILL.md
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)

---

### Session 4 - 2025-03-10

#### Prompt (Developer)

E2E Mailpit: Docker Compose, env example, and test_clean integration. Implement the plan as specified.

#### Key Decisions

- Mailpit moved from inline docker run/start in Makefile to infra/docker/e2e/docker-compose.yml (single mailpit service, ports 1025/8025, container_name boilerplate_e2e_mailpit).
- Added infra/docker/e2e/.env.example documenting E2E mailer vars (MAILER_ENABLED, SMTP_HOST, SMTP_PORT, MAIL_FROM, APP_BASE_URL).
- e2e_mailpit_up/down/clean now use docker compose -f infra/docker/e2e/docker-compose.yml; e2e_mailpit_clean delegates to e2e_mailpit_down.
- test_clean runs E2E compose down so Postgres, Valkey, and Mailpit are all removed; no lingering Mailpit. help_test mentions E2E Mailpit and that test_clean removes it.
- Docs and e2e-page-tests skill updated to state Mailpit is in compose and test_clean removes it; env example path documented.

#### Files Created/Modified

- infra/docker/e2e/docker-compose.yml (new)
- infra/docker/e2e/.env.example (new)
- makefiles/local/Makefile.local.e2e.mk (e2e_mailpit_* use compose)
- makefiles/local/Makefile.local.test.mk (test_clean, help_test)
- docs/testing/E2E-PAGE-TESTING.md
- .cursor/skills/e2e-page-tests/SKILL.md
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)

---

### Session 5 - 2026-03-11

#### Prompt (Developer)

dual outcomes should NOT be permitted in e2e tests. make sure a skill tells you this if it doesn't already

#### Key Decisions

- Added an explicit policy to the E2E page testing skill: E2E tests must assert one deterministic outcome and must not allow "either/or" pass conditions.

#### Files Modified

- .cursor/skills/e2e-page-tests/SKILL.md
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)

---

### Session 6 - 2026-03-11

#### Prompt (Developer)

the e2e and integration tests should properly test the sign up, reset password, forgot pasword, email verification, and other auth related tests. note how env vars can significantly affect how these pages and endpoints should behave. follow good practices according to skills to separate the different env var test paths

#### Key Decisions

- Admin-only web E2E paths were tightened to deterministic disabled-verification behavior: forgot-password now expects the config alert, and reset-password weak-password case no longer allows dual outcomes.
- Added explicit signup-enabled web auth specs for forgot-password and reset-password so mode-dependent behavior is validated under `AUTH_MODE=user_signup_email` + `MAILER_ENABLED=true` without mixing outcomes.
- Signup-enabled E2E execution now runs all signup-enabled auth specs together (signup + forgot-password + reset-password) via shared Makefile spec variables for normal and report targets.
- Added an API integration env-path suite for `AUTH_MODE=user_signup_email` with `MAILER_ENABLED=false` to assert signup and verification endpoints remain blocked when mailer is not enabled.
- Docs and e2e-page-tests skill were updated to reflect expanded signup-enabled auth-spec scope.

#### Files Modified

- apps/web/e2e/forgot-password-unauthenticated.spec.ts
- apps/web/e2e/reset-password-unauthenticated.spec.ts
- apps/web/e2e/forgot-password-unauthenticated-signup-enabled.spec.ts (new)
- apps/web/e2e/reset-password-unauthenticated-signup-enabled.spec.ts (new)
- apps/api/src/test/auth-signup-mode-no-mailer.test.ts (new)
- makefiles/local/Makefile.local.e2e.mk
- apps/web/playwright.signup-enabled.config.ts
- docs/testing/E2E-PAGE-TESTING.md
- .cursor/skills/e2e-page-tests/SKILL.md
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)

---

### Session 7 - 2026-03-11

#### Prompt (Developer)

review these. if they are active, but sufficiently completed, move to completed. if they are not completed, or they are out of date, just let me know but do not proceed to work on them. also consider if any are supplanted by active plans.

#### Key Decisions

- e2e-split-by-auth-mode plan set (00–03) was reviewed: all three parts were implemented in Sessions 1–3; Sessions 4–6 added Mailpit compose, dual-outcome skill policy, and expanded signup-enabled auth E2E. Plan set is sufficiently completed and not supplanted (auth-mode-invitation-rollout extended it with a third mode; e2e-split scope remains done).
- Moved the four plan files from `.llm/plans/active/e2e-split-by-auth-mode/` to `.llm/plans/completed/e2e-split-by-auth-mode/`. Added a note in completed 00-EXECUTION-ORDER that the three-mode E2E matrix lives in auth-mode-invitation-rollout.

#### Files Created/Modified

- .llm/plans/completed/e2e-split-by-auth-mode/00-EXECUTION-ORDER.md (created, with note re auth-mode-invitation-rollout)
- .llm/plans/completed/e2e-split-by-auth-mode/01-baseline-admin-only.md (created)
- .llm/plans/completed/e2e-split-by-auth-mode/02-signup-enabled-mailpit-and-spec.md (created)
- .llm/plans/completed/e2e-split-by-auth-mode/03-documentation.md (created)
- .llm/plans/active/e2e-split-by-auth-mode/* (four files deleted)
- .llm/history/active/e2e-split-by-auth-mode/e2e-split-by-auth-mode.md (this file)
