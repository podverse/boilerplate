# Plan 35: API integration test setup

## Scope

Add a test framework and testable app factory for the API so that auth (and future) endpoints
can be exercised via HTTP (supertest) against a real Express app and a real test database.
**Narrow focus:** setup only — no test cases yet (see plan 36). Clarify DB/Valkey and mailer
strategy so verification flows are testable without a local mailer service and without
creating/destroying database or Valkey instances.

## Decisions

### Database and Valkey: no create/destroy of instances

- **Postgres:** Use a **dedicated test database** (e.g. `DB_NAME=boilerplate_test`) on the
  **same** Postgres server as dev. Do **not** start/stop Postgres in tests; do not use
  testcontainers or ephemeral Postgres for this plan.
- **Schema:** Before the test run (globalSetup or beforeAll), ensure the test DB exists and
  run the combined init script ([infra/database/combined/init_database.sql](../../../infra/database/combined/init_database.sql)) so tables exist. Document that the test DB must be created once (e.g. `createdb boilerplate_test`) and that init is run as part of test setup or CI.
- **Valkey:** Use the **same** Valkey instance as dev. Set `VALKEY_HOST`, `VALKEY_PORT`,
  `VALKEY_PASSWORD` in test env so startup validation passes. Do **not** start/stop Valkey
  in tests. (Valkey is only validated at startup today; no auth code uses it.)

### Mailer: mock in tests — no local mailer service

- **No MailHog, Mailpit, or real SMTP** in the test process. Running a local mailer service
  would add infra and non-determinism; it is not required.
- **Strategy:** In tests that need verification flows (verify-email, forgot-password,
  reset-password, request-email-change, confirm-email-change), use Vitest
  `vi.mock('...lib/mailer/send.js')` to replace the mailer module with a test double that:
  - Implements `isMailerEnabled()` returning `true` when we want verification routes active.
  - Implements `sendVerificationEmail(to, token)`, `sendPasswordResetEmail(to, token)`,
    `sendEmailChangeVerificationEmail(to, token)` as no-ops that **capture** the last
    `token` (and optionally `to`) in a variable or object accessible to the test.
- Tests then call e.g. `POST /verify-email` with `{ token: capturedToken }` and assert 200.
  Verification endpoints are thus testable in an automated way without sending real email.

## Steps

1. **Test framework (apps/api)**
   - Add Vitest and supertest to `apps/api` (devDependencies): `vitest`, `supertest`,
     `@types/supertest`.
   - Add `apps/api/vitest.config.ts` (or `.mjs`) with ESM and path/glob for test files
     (e.g. `src/**/*.test.ts` or `test/**/*.test.ts`).
   - Add root `package.json` script: `"test": "npm run test -w apps/api"` (or equivalent).
   - Add `apps/api/package.json` script: `"test": "vitest run"`, `"test:watch": "vitest"`.

2. **App factory**
   - Refactor [apps/api/src/index.ts](../../../apps/api/src/index.ts) so that the Express
     app is built by a function (e.g. `createApp()`) that takes no arguments or only
     config-like options, and **returns** the app without calling `listen()`. The function
     must use the already-initialized DataSource and config (same as today). Keep
     startup validation and DataSource initialization in `index.ts`; then call
     `createApp()` and `app.listen(config.port)`.
   - Export `createApp` (or the chosen name) from a module that tests can import (e.g.
     from `index.ts` or from a new `app.ts`). Tests will call `createApp()` after
     test env and DataSource are set up.

3. **Test DB bootstrap**
   - Document that tests expect a test database (e.g. `boilerplate_test`) to exist. In
     CI, add a step that creates the database (if not exists) and runs the combined init
     script against it (plan 36 will add the CI job details).
   - In test setup (globalSetup or beforeAll), ensure the app can connect to the test DB:
     set `process.env.DB_NAME` (or full test env) to the test DB name before initializing
     the DataSource. Optionally run the init SQL from the test setup if the test DB is
     empty (or rely on CI to do it once). Keep it simple: one test DB, schema applied
     once per run or once in CI.

4. **Test env and startup**
   - Tests need all env vars required by [apps/api/src/lib/startup/validation.ts](../../../apps/api/src/lib/startup/validation.ts) (API_PORT, APP_NAME, JWT_SECRET, DB_*, VALKEY_*, etc.). Use a `.env.test` or set env in globalSetup/beforeAll from a fixture or from CI. For mailer-disabled tests, do not set `MAILER_ENABLED=true`. For mailer-enabled tests, set `MAILER_ENABLED=true` and rely on the mailer mock so no real SMTP is needed.

5. **Docs**
   - In [AGENTS.md](../../../AGENTS.md) or [docs/](../../../docs/): add a short "Testing"
     section: how to run tests (`npm run test` from root; use `./scripts/nix/with-env
     npm run test` in agent/Nix environments), requirement for a test database and for
     init script to have been applied, and that no local mailer service is required
     (mailer is mocked in tests).

## Key files

- `apps/api/vitest.config.ts` (or `.mjs`)
- `apps/api/package.json` (scripts, devDependencies)
- Root `package.json` (test script)
- `apps/api/src/index.ts` (extract createApp; export for tests)
- Optionally `apps/api/src/app.ts` (if createApp lives in a separate module)
- `apps/api/src/test/setup.ts` or globalSetup (env, DB name, optional init)
- AGENTS.md or docs (testing section)

## Verification

- From repo root, `npm run test` (or `./scripts/nix/with-env npm run test`) runs Vitest;
  it may report 0 tests until plan 36 adds auth tests.
- No Postgres or Valkey process is started or stopped by the test runner.
- No mailer service is started; tests that need verification flows will use a mock (plan 36).
