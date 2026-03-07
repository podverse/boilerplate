# E2E Page Tests – Foundation

## Scope

Foundation for running E2E page tests: documentation, Make targets
(prepare/teardown, API gate, seed, Playwright), deterministic seed scripts for
web and management-web, one proof-of-concept test on each app (dashboard after
login), and a reporting/artifact baseline for visual QA review.

## Deliverables

- **Docs**: [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md) – Purpose, prerequisites, Make targets, flow (API tests run first; on failure, Playwright is not run), deterministic data, ports, where specs live.
- **Make**: `make e2e_deps`, `e2e_seed`, `e2e_seed_web`, `e2e_seed_management_web`, `e2e_test_api`, `e2e_test`, `e2e_test_web`, `e2e_test_management_web`, `e2e_teardown`. E2E test targets run API integration tests first, then re-seed, then Playwright.
- **Seed**: `tools/web/seed-e2e.mjs` (main DB), `tools/management-web/seed-e2e.mjs` (management DB). Fixed user(s) and buckets/admin for reproducible assertions.
- **Playwright**: Config and one spec in `apps/web/e2e/` and `apps/management-web/e2e/` (dashboard loads after login).
- **Reporting baseline**: Playwright HTML report + Trace Viewer with failure
  screenshots/videos retained for human-readable test review.

## Reporting strategy (open source)

Primary recommendation:

- Playwright HTML report (`reporter: [['list'], ['html', { open: 'never' }]]`)
- `trace: 'retain-on-failure'`
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`

This provides pass/fail context per test, direct links to artifacts, and visual
evidence for QA review. Optional future extension: Allure for richer cross-run
history and dashboards.

## Verification

- `make e2e_deps` brings up test DBs; `make e2e_seed` runs without error.
- `make e2e_test_api` runs API tests; on success, `make e2e_test_web` (with web + API running) runs Playwright for web; same for management-web.
- Test run output can be reviewed in Playwright HTML report with linked
  trace/screenshot/video artifacts when failures occur.
