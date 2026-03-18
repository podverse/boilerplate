# 09 – Testing improvements

## Scope

Identify gaps in test coverage (unit, integration, E2E) and add or improve tests for
under-tested areas: API and management-api routes, and critical web and management-web user
flows. Ensure test setup and environment (e.g. Makefile, globalSetup) are documented and stable.

## Steps

### 1. Identify gaps

- **API**: List all route handlers in `apps/api`; for each, check if there is an integration
  test (e.g. in `apps/api/src/test/`) that covers success and key error cases. Flag routes with
  no or minimal coverage.
- **Management API**: Same for `apps/management-api` routes and `apps/management-api/src/test/`.
- **Web / Management-web**: List critical user flows (login, signup, bucket CRUD, settings,
  password reset, etc.). For management-web: admin login, user/bucket/admin CRUD, permission
  edits, and any other main nav flows. For each, check if there is an E2E spec (e.g. in
  `apps/web/e2e/`, `apps/management-web/e2e/`) that covers the happy path and important
  error/edge cases. Flag flows with no or weak E2E coverage. Suggested checklist: list route
  files in `apps/api/src/routes/` and `apps/management-api/src/routes/` and tick each that has
  a corresponding integration test file.

### 2. Add integration tests for API and management-api

- For each untested or under-tested route, add or extend an integration test file. Use the
  existing test setup (e.g. `apps/api/src/test/setup.ts`, globalSetup) and patterns (e.g. auth
  helpers, request helpers). Cover: success (200/201), validation errors (400), auth errors
  (401/403), and not-found where applicable.
- Ensure tests are deterministic (no flaky timeouts or ordering); use the same DB seeding/cleanup
  approach as the rest of the suite.

### 3. Add or extend E2E tests for web and management-web

- For each critical flow that lacks E2E coverage, add a new spec or extend an existing one.
  Follow the project’s E2E conventions (e.g. Make targets, SPEC=, fixtures, page objects).
  Cover: navigation to the feature, main action (e.g. create bucket, edit message), and
  verification that the UI reflects the change. Add auth and permission variants if the skill
  (e2e-permission-actor-matrix, etc.) applies.
- Keep specs focused and readable; avoid one giant spec that does everything.

### 4. Document test setup and env

- Ensure README, AGENTS.md, or a dedicated test doc describes: how to run unit/integration tests
  (e.g. `npm run test`), how to run E2E (e.g. `make e2e_test_web_report_spec SPEC=...`), and
  what dependencies are required (e.g. Postgres, Valkey, `make test_deps`). Document
  globalSetup and any env vars used by tests.
- If the Makefile has test targets, ensure they are listed in help or docs so contributors know
  how to run tests.

### 5. Verify

- Run the full test suite (unit + integration) from repo root; all pass.
- Run the relevant E2E targets for the areas you touched; they pass or are fixed.
- New tests are committed and CI will run them.

## Key files

- `apps/api/src/test/` (setup, globalSetup, *.test.ts)
- `apps/management-api/src/test/` (setup, globalSetup, *.test.ts)
- `apps/web/e2e/` (specs, helpers, fixtures)
- `apps/management-web/e2e/` (specs, helpers, fixtures)
- Makefile (test_deps, e2e targets, help)
- AGENTS.md or docs that describe testing

## Verification

- Coverage improved for previously untested or under-tested routes and flows.
- `npm run test` (or equivalent) and relevant `make` E2E targets pass.
- Test setup and how to run tests are documented.
