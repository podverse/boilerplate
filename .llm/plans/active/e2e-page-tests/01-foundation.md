# E2E Page Tests – Foundation

## Scope

Foundation for running E2E page tests: documentation, Make targets (prepare/teardown, API gate, seed, Playwright), deterministic seed scripts for web and management-web, and one proof-of-concept test on each app (dashboard after login).

## Deliverables

- **Docs**: [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md) – Purpose, prerequisites, Make targets, flow (API tests run first; on failure, Playwright is not run), deterministic data, ports, where specs live.
- **Make**: `make e2e_deps`, `e2e_seed`, `e2e_seed_web`, `e2e_seed_management_web`, `e2e_test_api`, `e2e_test`, `e2e_test_web`, `e2e_test_management_web`, `e2e_teardown`. E2E test targets run API integration tests first, then re-seed, then Playwright.
- **Seed**: `tools/web/seed-e2e.mjs` (main DB), `tools/management-web/seed-e2e.mjs` (management DB). Fixed user(s) and buckets/admin for reproducible assertions.
- **Playwright**: Config and one spec in `apps/web/e2e/` and `apps/management-web/e2e/` (dashboard loads after login).

## Verification

- `make e2e_deps` brings up test DBs; `make e2e_seed` runs without error.
- `make e2e_test_api` runs API tests; on success, `make e2e_test_web` (with web + API running) runs Playwright for web; same for management-web.
