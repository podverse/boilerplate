---
name: api-testing
description: When changing API routes, auth, or env-dependent behavior, add or update the corresponding integration tests and keep the test file layout consistent.
---

# API Integration Testing (Boilerplate)

Use this skill when adding or changing auth endpoints, versioned routes, or any API behavior that depends on environment variables. Keep tests in sync and use the correct test file and base URL.

## Test file layout

| File | Scope | When to update |
|------|--------|----------------|
| `apps/api/src/test/auth.test.ts` | **Shared** – endpoints unaffected by mailer mode: versioned root (GET /health, GET /), login, logout, me, change-password | Add tests for new shared auth or versioned routes; add validation/error cases for these endpoints. |
| `apps/api/src/test/auth-no-mailer.test.ts` | **No-mailer (admin-only)** – signup → 403, all verification routes → 403 | Change when no-mailer behavior or verification route list changes. |
| `apps/api/src/test/auth-mailer.test.ts` | **Mailer-enabled (mocked)** – signup, verify-email, forgot/reset-password, request/confirm-email-change; uses `vi.mock` to capture tokens | Change when verification flows or mailer-dependent behavior changes; add validation tests (400/401) for these endpoints. |

- **Base URL**: Use `config.apiVersionPath` (from `../config/index.js`), never hardcode `/v1`. Example: `const API = config.apiVersionPath;` then `request(app).get(\`${API}/health\`)`.
- **Naming**: Mode-specific tests live in files with consistent names: `auth-no-mailer.test.ts`, `auth-mailer.test.ts`. If you add another mode (e.g. invite-only), add `auth-<mode>.test.ts` and document it in file headers and AGENTS.md.

## Clean slate and requirements

- **Clean slate**: Each test run truncates app tables once via Vitest `globalSetup` (`apps/api/src/test/global-setup.mjs`). No manual DB wipe needed between runs.
- **Requirements**: Before tests, Postgres and Valkey must be up and the test DB created. Root `npm run test` runs `scripts/check-test-requirements.mjs` first; if ports are unreachable, it exits with instructions. From repo root: `make test_deps` (note underscore) starts containers (ports 5532, 6479), creates `boilerplate_test`, applies schema, and grants read/read_write (including TRUNCATE for globalSetup). Make targets use **underscores**: `test_deps`, `help_test`, `test_clean`.

## What to update when the API changes

1. **New versioned or shared auth route**  
   Add tests in `auth.test.ts` (happy path and validation/error cases as appropriate).

2. **New or changed verification or mailer-dependent route**  
   Add or update tests in `auth-mailer.test.ts` (with mailer mocked). Add corresponding 403 tests in `auth-no-mailer.test.ts` for the same path.

3. **New env mode (e.g. AUTH_MODE or new feature flag)**  
   Add a new test file `auth-<mode>.test.ts` with a clear top-level describe (e.g. `auth-invite-only (mocked)`), set the env in that file, and document in its header and in AGENTS.md.

4. **Schema/ORM change**  
   Ensure entity column names match the DB (e.g. `@PrimaryColumn('uuid', { name: 'user_id' })` for `UserCredentials` and `UserBio`). Otherwise integration tests will fail with “column does not exist” (TypeORM uses property name by default).

5. **New app table that should be cleared between runs**  
   Update `global-setup.mjs`: either extend the single `TRUNCATE "user" ... CASCADE` if the new table references `user`, or add an explicit `TRUNCATE` for the new table.

## Quick reference

- Run tests: `npm run test` from repo root (or `./scripts/nix/with-env npm run test` in Nix/agent). First step is the requirements check, then Vitest runs globalSetup then test files.
- Test env: `apps/api/src/test/setup.ts` sets defaults (DB_PORT 5532, VALKEY_PORT 6479, DB_NAME boilerplate_test, etc.). globalSetup uses the same defaults so it can run without setupFiles.
- Mailer in tests: No real SMTP. `auth-mailer.test.ts` sets `MAILER_ENABLED=true` and mocks `../lib/mailer/send.js` to capture tokens for verify-email, reset-password, and confirm-email-change.
