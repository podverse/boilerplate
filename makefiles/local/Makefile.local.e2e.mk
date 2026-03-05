# --- E2E page testing (web and management-web). API tests run first; on failure, Playwright is not run. ---
# See docs/testing/E2E-PAGE-TESTING.md

.PHONY: e2e_deps e2e_seed e2e_seed_web e2e_seed_management_web e2e_test_api e2e_test e2e_test_web e2e_test_management_web e2e_teardown

# Reuse test DBs and schema. Same as test_deps.
e2e_deps: test_deps
	@echo "E2E deps ready (test DBs and schema)."

# Run deterministic seed for web only (main DB). Requires e2e_deps.
e2e_seed_web: e2e_deps
	@node tools/web/seed-e2e.mjs

# Run deterministic seed for management-web only. Requires e2e_deps.
e2e_seed_management_web: e2e_deps
	@node tools/management-web/seed-e2e.mjs

# Run deterministic seed for both web and management-web.
e2e_seed: e2e_seed_web e2e_seed_management_web
	@echo "E2E seed complete (web + management-web)."

# Run API integration tests only (api + management-api). Fail fast; used as gate before Playwright.
e2e_test_api: e2e_deps
	@npm run test

# Run API tests first; on success, re-seed (API globalSetup truncates), then run Playwright for web only.
e2e_test_web: e2e_test_api e2e_seed_web
	@npm run test:e2e -w apps/web

# Run API tests first; on success, re-seed, then run Playwright for management-web only.
e2e_test_management_web: e2e_test_api e2e_seed_management_web
	@npm run test:e2e -w apps/management-web

# Run API tests first; on success, re-seed both, then run Playwright for both web and management-web.
e2e_test: e2e_test_api e2e_seed
	@npm run test:e2e -w apps/web && npm run test:e2e -w apps/management-web

# Stop processes started for E2E. Does not drop DBs; run make test_clean for full teardown of test containers.
e2e_teardown:
	@echo "E2E teardown: stop API, sidecar, web, and management-web processes if you started them (e.g. Ctrl+C). For full cleanup: make test_clean"
