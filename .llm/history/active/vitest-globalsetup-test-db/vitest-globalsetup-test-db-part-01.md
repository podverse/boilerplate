# Vitest globalSetup test DB alignment

**Started:** 2026-03-24  
**Context:** Align globalSetup defaults with `make test_db_init` roles; unblock `npm run test` / E2E API gate locally.

### Session 1 - 2026-03-24

#### Prompt (Developer)

Align Vitest globalSetup with deterministic test DB users

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **`global-setup.mjs` (api + management-api):** Default `DB_*_READ_WRITE_USER` values now match `boilerplate_app_read_write` and `boilerplate_management_read_write` (and api read user `boilerplate_app_read`). Comments note globalSetup does not load `setup.ts`.
- **`@boilerplate/helpers` `validateStartupRequirements`:** Throws when `summary.failed > 0` (not only `requiredMissing`), so optional checks such as `validateOptionalUnset` actually fail startup—fixes `rejects admin_only_username when MAILER_USER is set` once helpers dist is rebuilt.
- **`apps/api` `validation.ts`:** For `admin_only_username`, only `MAILER_USER` and `MAILER_PASSWORD` use `validateOptionalUnset`; `MAILER_HOST` / `MAILER_PORT` / `MAILER_FROM` may remain set from shared env (matches integration tests and `does not fail startup when optional mailer env is set`).

#### Files Created/Modified

- `apps/api/src/test/global-setup.mjs`
- `apps/management-api/src/test/global-setup.mjs`
- `packages/helpers/src/startup/validation.ts`
- `apps/api/src/lib/startup/validation.ts`

### Session 2 - 2026-03-24

#### Prompt (Developer)

align

#### Key Decisions

- E2E seed scripts default DB user fallbacks match `make test_db_init`: **`boilerplate_app_read_write`** (web) and **`boilerplate_management_read_write`** (management-web), replacing legacy `read_write`.

#### Files Created/Modified

- `tools/web/seed-e2e.mjs`
- `tools/management-web/seed-e2e.mjs`

### Session 3 - 2026-03-24

#### Prompt (Developer)

Fix E2E Playwright DB user mismatch (`read` / `read_write`)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **Web Playwright (default, signup-enabled, admin-only-email):** Inline `webServer` env already uses `DB_APP_READ_USER=boilerplate_app_read` and `DB_APP_READ_WRITE_USER=boilerplate_app_read_write` (aligned with `make test_db_init`).
- **Management-web Playwright:** `e2eManagementApiEnv` uses `DB_MANAGEMENT_*` and `DB_APP_*` (no `MANAGEMENT_DB_*`); added **`MANAGEMENT_API_USER_AGENT`** with a double-quoted value so management-api startup validation passes without a `.env` file.
- **AGENTS.md:** Test-deps bullet now names the concrete role names instead of generic “read/read_write users.”
- **Docs grep:** No stale Postgres `read`/`read_write` role strings in `docs/testing/E2E-PAGE-TESTING.md`; optional doc tweak not required beyond AGENTS.
- **Verification:** `make test_deps` and `make e2e_seed` succeeded; one-file Playwright smoke reached **API listening on port 4010** (no `28P01` for user `read`); full Playwright run failed in this environment only because Chromium was not installed under the agent cache path.

#### Files Created/Modified

- `apps/management-web/playwright.config.ts` (session: `MANAGEMENT_API_USER_AGENT`)
- `AGENTS.md`
