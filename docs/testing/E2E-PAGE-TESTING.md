# E2E Page Testing (Web and Management-Web)

End-to-end testing for web and management-web page layouts and interactions. Every page
and interaction (without entering infinite loops) should be covered, with deterministic
outcomes via fixed seed data.

## Purpose

- Test every page layout and interaction for apps/web and apps/management-web.
- Guarantee the same results and values each run using predefined, constant data
  seeded in the database before tests.
- **Gate**: API and management-api integration tests must run and **pass** before any
  web or management-web E2E tests run. If any API/management-api test fails, the process
  stops and Playwright is not executed.

## Prerequisites

- Node.js 24+, npm, Docker (Postgres, Valkey).
- Nix users: run commands via `./scripts/nix/with-env <command>` from repo root.

## Make targets

| Target                    | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `e2e_deps`                | Start Postgres (5532), Valkey (6479), create test DBs and schema.          |
| `e2e_seed`                | Load deterministic seed for both web and management-web.                   |
| `e2e_seed_web`            | Load deterministic seed for web E2E only (main DB).                        |
| `e2e_seed_management_web` | Load deterministic seed for management-web E2E only.                       |
| `e2e_test_api`            | Run API integration tests only (api + management-api).                     |
| `e2e_test`                | Run API tests first (fail fast), then E2E for both web and management-web. |
| `e2e_test_web`            | Run API tests first (fail fast), then E2E for web only.                    |
| `e2e_test_management_web` | Run API tests first (fail fast), then E2E for management-web only.         |
| `e2e_teardown`            | Stop processes started for E2E (dev servers, API, sidecar).                |

**API gate**: `e2e_test`, `e2e_test_web`, and `e2e_test_management_web` all run API
integration tests first. On first failure, Make exits and Playwright is not run.

## Flow

1. **`make e2e_deps`** — Test DBs and schema (same as `test_deps`: Postgres 5532,
   Valkey 6479, `boilerplate_test`, `boilerplate_management_test`).
2. **`make e2e_seed`** — Load deterministic fixtures (idempotent: truncate + insert).
3. Start API (and sidecar for web) and the app(s) under test (manually or via script).
4. **Run API integration tests** — `npm run test` (api + management-api). **If any fail,
   stop and do not run Playwright.**
5. Run Playwright (e.g. `make e2e_test_web` or `make e2e_test_management_web`).
6. **`make e2e_teardown`** — Stop services. For full cleanup (remove test containers),
   run `make test_clean`.

## Deterministic data

- Seed scripts live in `tools/web/` (web E2E) and `tools/management-web/` (management-web
  E2E). E2E must not rely on faker without a fixed seed; use dedicated E2E seed scripts
  that insert a fixed set of rows (e.g. one user, two buckets, one child bucket).
- Same rows and IDs every run so assertions (e.g. “dashboard shows bucket X”) are
  stable.

## Ports

| Service        | Port |
| -------------- | ---- |
| Test Postgres  | 5532 |
| Test Valkey    | 6479 |
| API            | 4000 |
| Web            | 4002 |
| Management-web | 4102 |
| Sidecar (web)  | 4001 |

See apps’ `.env.example` for `NEXT_PUBLIC_*` and `RUNTIME_CONFIG_URL`.

## Where specs live

- **Web**: `apps/web/e2e/` (or `apps/web/tests/e2e/`) — Playwright config and specs.
- **Management-web**: `apps/management-web/e2e/` (or `apps/management-web/tests/e2e/`).
- Shared, non–app-specific logic can live in `tools/` (e.g. `tools/e2e/`).

Do not run API tests and E2E concurrently against the same DB; run one or the other,
or use separate DB names for E2E if you prefer isolation.
