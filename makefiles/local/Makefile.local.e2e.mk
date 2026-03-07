# --- E2E page testing (web and management-web). API tests run first; on failure, Playwright is not run. ---
# See docs/testing/E2E-PAGE-TESTING.md

.PHONY: e2e_deps e2e_seed e2e_seed_web e2e_seed_management_web e2e_test_api e2e_test e2e_test_web e2e_test_management_web e2e_test_web_home e2e_test_management_web_home e2e_test_home e2e_test_home_report e2e_test_report e2e_teardown

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
# Playwright auto-starts API/sidecar/web on dedicated E2E ports (4010/4011/4012)
# using production-like build/start commands.
e2e_test_web: e2e_test_api e2e_seed_web
	@npm run test:e2e -w apps/web

# Run API tests first; on success, re-seed, then run Playwright for management-web only.
# Playwright auto-starts management-api/management-web on dedicated E2E ports (4110/4112)
# using production-like build/start commands.
e2e_test_management_web: e2e_test_api e2e_seed_management_web
	@npm run test:e2e -w apps/management-web

# Run API tests first; on success, re-seed web, then run only web home smoke test.
# Uses isolated E2E app ports (4010/4011/4012); no dependency on default dev ports.
e2e_test_web_home: e2e_test_api e2e_seed_web
	@npm run test:e2e -w @boilerplate/web -- e2e/home.spec.ts

# Run API tests first; on success, re-seed management-web, then run only management home smoke test.
# Uses isolated E2E app ports (4110/4112); no dependency on default dev ports.
e2e_test_management_web_home: e2e_test_api e2e_seed_management_web
	@npm run test:e2e -w @boilerplate/management-web -- e2e/home.spec.ts

# Run API tests first; on success, re-seed both, then run only home smoke tests for both apps.
# Both Playwright projects auto-start required app processes on dedicated E2E ports
# using production-like build/start commands.
e2e_test_home: e2e_test_api e2e_seed
	@npm run test:e2e -w @boilerplate/web -- e2e/home.spec.ts && npm run test:e2e -w @boilerplate/management-web -- e2e/home.spec.ts

# Alternate home smoke command: generate timestamped HTML reports, update latest symlink,
# then open both result pages in the default system browser. Report opens even when tests fail.
e2e_test_home_report: e2e_test_api e2e_seed
	@TS=$$(date +"%Y%m%d-%H%M%S"); \
	ROOT_DIR="$$(pwd)"; \
	BASE_DIR="$$ROOT_DIR/.artifacts/e2e-reports"; \
	RUN_DIR="$$BASE_DIR/$$TS"; \
	WEB_REPORT_DIR="$$RUN_DIR/web"; \
	MGMT_REPORT_DIR="$$RUN_DIR/management-web"; \
	mkdir -p "$$WEB_REPORT_DIR" "$$MGMT_REPORT_DIR"; \
	WEB_EXIT=0; E2E_STEP_SCREENSHOTS=true PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$WEB_REPORT_DIR" npm run test:e2e -w @boilerplate/web -- --reporter=../../scripts/e2e-html-steps-reporter.ts e2e/home.spec.ts || WEB_EXIT=$$?; \
	MGMT_EXIT=0; E2E_STEP_SCREENSHOTS=true PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$MGMT_REPORT_DIR" npm run test:e2e -w @boilerplate/management-web -- --reporter=../../scripts/e2e-html-steps-reporter.ts e2e/home.spec.ts || MGMT_EXIT=$$?; \
	ln -sfn "$$TS" "$$BASE_DIR/latest"; \
	RUN_DIRS=$$((ls -1d "$$BASE_DIR"/20??????-?????? 2>/dev/null || true) | sort); \
	RUN_COUNT=$$(printf "%s\n" "$$RUN_DIRS" | sed '/^$$/d' | wc -l | tr -d ' '); \
	if [ "$$RUN_COUNT" -gt 10 ]; then \
		REMOVE_COUNT=$$((RUN_COUNT - 10)); \
		printf "%s\n" "$$RUN_DIRS" | sed '/^$$/d' | head -n "$$REMOVE_COUNT" | while IFS= read -r OLD_DIR; do \
			if [ -n "$$OLD_DIR" ]; then \
				rm -rf "$$OLD_DIR"; \
			fi; \
		done; \
		echo "Rotated old E2E reports: kept newest 10 timestamped directories."; \
	fi; \
	WEB_INDEX="$$WEB_REPORT_DIR/index.html"; \
	MGMT_INDEX="$$MGMT_REPORT_DIR/index.html"; \
	echo "E2E reports:"; \
	echo "  $$WEB_INDEX"; \
	echo "  $$MGMT_INDEX"; \
	echo "Latest symlink: $$BASE_DIR/latest"; \
	if command -v open >/dev/null 2>&1; then \
		[ -f "$$WEB_INDEX" ] && open "$$WEB_INDEX" || echo "Could not auto-open $$WEB_INDEX"; \
		[ -f "$$MGMT_INDEX" ] && open "$$MGMT_INDEX" || echo "Could not auto-open $$MGMT_INDEX"; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		[ -f "$$WEB_INDEX" ] && xdg-open "$$WEB_INDEX" >/dev/null 2>&1 || echo "Could not auto-open $$WEB_INDEX"; \
		[ -f "$$MGMT_INDEX" ] && xdg-open "$$MGMT_INDEX" >/dev/null 2>&1 || echo "Could not auto-open $$MGMT_INDEX"; \
	else \
		echo "Could not auto-open browser (no open/xdg-open). Open the files manually."; \
	fi; \
	if [ "$$WEB_EXIT" -ne 0 ] || [ "$$MGMT_EXIT" -ne 0 ]; then exit 1; fi

# Run API tests first; on success, re-seed both, then run Playwright for both web and management-web.
e2e_test: e2e_test_api e2e_seed
	@npm run test:e2e -w apps/web && npm run test:e2e -w apps/management-web

# Full E2E suite in report mode: run all web and management-web tests with step screenshots,
# write timestamped HTML reports (same layout as e2e_test_home_report), rotate to 10 runs, open both in browser.
# Report opens even when tests fail.
e2e_test_report: e2e_test_api e2e_seed
	@TS=$$(date +"%Y%m%d-%H%M%S"); \
	ROOT_DIR="$$(pwd)"; \
	BASE_DIR="$$ROOT_DIR/.artifacts/e2e-reports"; \
	RUN_DIR="$$BASE_DIR/$$TS"; \
	WEB_REPORT_DIR="$$RUN_DIR/web"; \
	MGMT_REPORT_DIR="$$RUN_DIR/management-web"; \
	mkdir -p "$$WEB_REPORT_DIR" "$$MGMT_REPORT_DIR"; \
	WEB_EXIT=0; E2E_STEP_SCREENSHOTS=true PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$WEB_REPORT_DIR" npm run test:e2e -w @boilerplate/web -- --reporter=../../scripts/e2e-html-steps-reporter.ts || WEB_EXIT=$$?; \
	MGMT_EXIT=0; E2E_STEP_SCREENSHOTS=true PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$MGMT_REPORT_DIR" npm run test:e2e -w @boilerplate/management-web -- --reporter=../../scripts/e2e-html-steps-reporter.ts || MGMT_EXIT=$$?; \
	ln -sfn "$$TS" "$$BASE_DIR/latest"; \
	RUN_DIRS=$$((ls -1d "$$BASE_DIR"/20??????-?????? 2>/dev/null || true) | sort); \
	RUN_COUNT=$$(printf "%s\n" "$$RUN_DIRS" | sed '/^$$/d' | wc -l | tr -d ' '); \
	if [ "$$RUN_COUNT" -gt 10 ]; then \
		REMOVE_COUNT=$$((RUN_COUNT - 10)); \
		printf "%s\n" "$$RUN_DIRS" | sed '/^$$/d' | head -n "$$REMOVE_COUNT" | while IFS= read -r OLD_DIR; do \
			if [ -n "$$OLD_DIR" ]; then \
				rm -rf "$$OLD_DIR"; \
			fi; \
		done; \
		echo "Rotated old E2E reports: kept newest 10 timestamped directories."; \
	fi; \
	WEB_INDEX="$$WEB_REPORT_DIR/index.html"; \
	MGMT_INDEX="$$MGMT_REPORT_DIR/index.html"; \
	echo "E2E reports:"; \
	echo "  $$WEB_INDEX"; \
	echo "  $$MGMT_INDEX"; \
	echo "Latest symlink: $$BASE_DIR/latest"; \
	if command -v open >/dev/null 2>&1; then \
		[ -f "$$WEB_INDEX" ] && open "$$WEB_INDEX" || echo "Could not auto-open $$WEB_INDEX"; \
		[ -f "$$MGMT_INDEX" ] && open "$$MGMT_INDEX" || echo "Could not auto-open $$MGMT_INDEX"; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		[ -f "$$WEB_INDEX" ] && xdg-open "$$WEB_INDEX" >/dev/null 2>&1 || echo "Could not auto-open $$WEB_INDEX"; \
		[ -f "$$MGMT_INDEX" ] && xdg-open "$$MGMT_INDEX" >/dev/null 2>&1 || echo "Could not auto-open $$MGMT_INDEX"; \
	else \
		echo "Could not auto-open browser (no open/xdg-open). Open the files manually."; \
	fi; \
	if [ "$$WEB_EXIT" -ne 0 ] || [ "$$MGMT_EXIT" -ne 0 ]; then exit 1; fi

# Stop processes started for E2E. Playwright-managed webServer processes stop automatically.
# Does not drop DBs; run make test_clean for full teardown of test containers.
e2e_teardown:
	@echo "E2E teardown: stop API, sidecar, web, and management-web processes if you started them (e.g. Ctrl+C). For full cleanup: make test_clean"
