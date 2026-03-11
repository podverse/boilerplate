# --- E2E page testing (web and management-web). API gate is configurable via E2E_API_GATE_MODE. ---
# See docs/testing/E2E-PAGE-TESTING.md

.PHONY: e2e_deps e2e_seed e2e_seed_web e2e_seed_management_web e2e_test_api e2e_test e2e_test_web e2e_test_management_web e2e_test_web_report_spec e2e_test_management_web_report_spec e2e_test_report_scoped e2e_test_report e2e_teardown

E2E_API_GATE_MODE ?= auto
E2E_API_GATE_REQUIRED_PATHS_REGEX := ^(apps/api/|apps/management-api/|infra/database/|infra/management-database/|packages/helpers/|packages/helpers-requests/|packages/helpers-validation/|packages/orm/|packages/management-orm/|tools/web/seed-e2e\.mjs|tools/management-web/seed-e2e\.mjs|scripts/e2e-html-steps-reporter\.ts|apps/web/playwright\.config\.ts|apps/management-web/playwright\.config\.ts|makefiles/local/Makefile\.local\.e2e\.mk)
# Conceptual order for full report (make e2e_test_report). Do not sort; order is from these files.
WEB_SPEC_ORDERED := $(shell sed '/^#/d;/^$$/d' makefiles/local/e2e-spec-order-web.txt | tr '\n' ' ')
MGMT_SPEC_ORDERED := $(shell sed '/^#/d;/^$$/d' makefiles/local/e2e-spec-order-management-web.txt | tr '\n' ' ')
# Semicolon-separated for E2E_SPEC_ORDER so the HTML reporter can reorder runs for display.
WEB_SPEC_ORDER_SEMICOLON := $(shell sed '/^#/d;/^$$/d' makefiles/local/e2e-spec-order-web.txt | tr '\n' ';')
MGMT_SPEC_ORDER_SEMICOLON := $(shell sed '/^#/d;/^$$/d' makefiles/local/e2e-spec-order-management-web.txt | tr '\n' ';')

define e2e_run_api_gate
MODE="$(E2E_API_GATE_MODE)"; \
if [ "$$MODE" = "on" ]; then \
	echo "E2E API gate: mode=on -> running API integration tests."; \
	$(MAKE) e2e_test_api; \
elif [ "$$MODE" = "off" ]; then \
	echo "E2E API gate: mode=off -> skipping API integration tests."; \
elif [ "$$MODE" = "auto" ]; then \
	if ! command -v git >/dev/null 2>&1; then \
		echo "E2E API gate: mode=auto -> git unavailable, skipping API integration tests (aggressive default)."; \
		echo "To force gate: make E2E_API_GATE_MODE=on <target>"; \
	else \
		CHANGED_FILES=$$((git diff --name-only; git diff --name-only --cached; git ls-files --others --exclude-standard) 2>/dev/null | sed '/^$$/d' | sort -u); \
		if [ -z "$$CHANGED_FILES" ]; then \
			echo "E2E API gate: mode=auto -> no changed files, skipping API integration tests."; \
		elif printf "%s\n" "$$CHANGED_FILES" | rg -q '$(E2E_API_GATE_REQUIRED_PATHS_REGEX)'; then \
			echo "E2E API gate: mode=auto -> API-impacting changes detected, running API integration tests."; \
			$(MAKE) e2e_test_api; \
		else \
			echo "E2E API gate: mode=auto -> no API-impacting changes detected, skipping API integration tests."; \
		fi; \
	fi; \
else \
	echo "Invalid E2E_API_GATE_MODE='$$MODE'. Expected one of: auto, on, off."; \
	exit 2; \
fi
endef

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

# Run API gate decision first; if gate runs and succeeds, re-seed (API globalSetup truncates), then run Playwright for web only.
# Playwright auto-starts API/sidecar/web on dedicated E2E ports (4010/4011/4012)
# using production-like build/start commands.
e2e_test_web:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed_web
	@npm run test:e2e -w apps/web

# Run API gate decision first; if gate runs and succeeds, re-seed both E2E datasets, then run Playwright for management-web only.
# Playwright auto-starts management-api/management-web on dedicated E2E ports (4110/4112)
# using production-like build/start commands.
e2e_test_management_web:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed
	@npm run test:e2e -w apps/management-web

# Run API gate decision first; if gate runs and succeeds, re-seed both, then run Playwright for both web and management-web.
e2e_test:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed
	@npm run test:e2e -w apps/web && npm run test:e2e -w apps/management-web

# Full E2E suite in report mode: run all web and management-web tests with step screenshots,
# write timestamped HTML reports (same layout as e2e_test_home_report), rotate to 10 runs, open both in browser.
# Report opens even when tests fail. Spec order is conceptual (home, buckets, etc.) from e2e-spec-order-*.txt.
e2e_test_report:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed
	@TS=$$(date +"%Y%m%d-%H%M%S"); \
	ROOT_DIR="$$(pwd)"; \
	BASE_DIR="$$ROOT_DIR/.artifacts/e2e-reports"; \
	RUN_DIR="$$BASE_DIR/$$TS"; \
	WEB_REPORT_DIR="$$RUN_DIR/web"; \
	MGMT_REPORT_DIR="$$RUN_DIR/management-web"; \
	mkdir -p "$$WEB_REPORT_DIR" "$$MGMT_REPORT_DIR"; \
	WEB_EXIT=0; E2E_STEP_SCREENSHOTS=true E2E_SPEC_ORDER="$(WEB_SPEC_ORDER_SEMICOLON)" PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$WEB_REPORT_DIR" npm run test:e2e -w @boilerplate/web -- --reporter=../../scripts/e2e-html-steps-reporter.ts $(WEB_SPEC_ORDERED) || WEB_EXIT=$$?; \
	MGMT_EXIT=0; E2E_STEP_SCREENSHOTS=true E2E_SPEC_ORDER="$(MGMT_SPEC_ORDER_SEMICOLON)" PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$MGMT_REPORT_DIR" npm run test:e2e -w @boilerplate/management-web -- --reporter=../../scripts/e2e-html-steps-reporter.ts $(MGMT_SPEC_ORDERED) || MGMT_EXIT=$$?; \
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

# Scoped report mode for one or more web E2E specs. Requires SPEC.
# SPEC supports a single path or comma-separated paths; tests run and appear in report in parameter order (do not reorder).
# (example: SPEC=e2e/buckets-unauthenticated.spec.ts,e2e/invite-unauthenticated.spec.ts).
# Runs API gate decision first, re-seeds web, captures step screenshots, writes timestamped report, rotates to 10 runs.
e2e_test_web_report_spec:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed_web
	@if [ -z "$(SPEC)" ]; then \
		echo "Missing SPEC. Usage: make e2e_test_web_report_spec SPEC=e2e/<spec>.spec.ts[,e2e/<spec>.spec.ts]"; \
		exit 2; \
	fi
	@TS=$$(date +"%Y%m%d-%H%M%S"); \
	ROOT_DIR="$$(pwd)"; \
	BASE_DIR="$$ROOT_DIR/.artifacts/e2e-reports"; \
	RUN_DIR="$$BASE_DIR/$$TS"; \
	WEB_REPORT_DIR="$$RUN_DIR/web"; \
	mkdir -p "$$WEB_REPORT_DIR"; \
	WEB_SPEC_ARGS=$$(printf "%s" "$(SPEC)" | tr ',' ' '); \
	WEB_SPEC_ORDER_SEMICOLON=$$(printf "%s" "$(SPEC)" | tr ',' ';'); \
	WEB_EXIT=0; E2E_STEP_SCREENSHOTS=true E2E_REPORT_SPEC="$(SPEC)" E2E_SPEC_ORDER="$$WEB_SPEC_ORDER_SEMICOLON" PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$WEB_REPORT_DIR" npm run test:e2e -w @boilerplate/web -- --reporter=../../scripts/e2e-html-steps-reporter.ts $$WEB_SPEC_ARGS || WEB_EXIT=$$?; \
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
	echo "Scoped web E2E report:"; \
	echo "  $$WEB_INDEX"; \
	echo "Latest symlink: $$BASE_DIR/latest"; \
	if command -v open >/dev/null 2>&1; then \
		[ -f "$$WEB_INDEX" ] && open "$$WEB_INDEX" || echo "Could not auto-open $$WEB_INDEX"; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		[ -f "$$WEB_INDEX" ] && xdg-open "$$WEB_INDEX" >/dev/null 2>&1 || echo "Could not auto-open $$WEB_INDEX"; \
	else \
		echo "Could not auto-open browser (no open/xdg-open). Open the file manually."; \
	fi; \
	if [ "$$WEB_EXIT" -ne 0 ]; then exit 1; fi

# Scoped report mode for one or more management-web E2E specs. Requires SPEC.
# SPEC supports a single path or comma-separated paths; tests run and appear in report in parameter order (do not reorder).
# (example: SPEC=e2e/buckets-unauthenticated.spec.ts,e2e/events-unauthenticated.spec.ts).
# Runs API gate decision first, re-seeds both E2E datasets, captures step screenshots, writes timestamped report, rotates to 10 runs.
e2e_test_management_web_report_spec:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed
	@if [ -z "$(SPEC)" ]; then \
		echo "Missing SPEC. Usage: make e2e_test_management_web_report_spec SPEC=e2e/<spec>.spec.ts[,e2e/<spec>.spec.ts]"; \
		exit 2; \
	fi
	@TS=$$(date +"%Y%m%d-%H%M%S"); \
	ROOT_DIR="$$(pwd)"; \
	BASE_DIR="$$ROOT_DIR/.artifacts/e2e-reports"; \
	RUN_DIR="$$BASE_DIR/$$TS"; \
	MGMT_REPORT_DIR="$$RUN_DIR/management-web"; \
	mkdir -p "$$MGMT_REPORT_DIR"; \
	MGMT_SPEC_ARGS=$$(printf "%s" "$(SPEC)" | tr ',' ' '); \
	MGMT_SPEC_ORDER_SEMICOLON=$$(printf "%s" "$(SPEC)" | tr ',' ';'); \
	MGMT_EXIT=0; E2E_STEP_SCREENSHOTS=true E2E_REPORT_SPEC="$(SPEC)" E2E_SPEC_ORDER="$$MGMT_SPEC_ORDER_SEMICOLON" PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$MGMT_REPORT_DIR" npm run test:e2e -w @boilerplate/management-web -- --reporter=../../scripts/e2e-html-steps-reporter.ts $$MGMT_SPEC_ARGS || MGMT_EXIT=$$?; \
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
	MGMT_INDEX="$$MGMT_REPORT_DIR/index.html"; \
	echo "Scoped management-web E2E report:"; \
	echo "  $$MGMT_INDEX"; \
	echo "Latest symlink: $$BASE_DIR/latest"; \
	if command -v open >/dev/null 2>&1; then \
		[ -f "$$MGMT_INDEX" ] && open "$$MGMT_INDEX" || echo "Could not auto-open $$MGMT_INDEX"; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		[ -f "$$MGMT_INDEX" ] && xdg-open "$$MGMT_INDEX" >/dev/null 2>&1 || echo "Could not auto-open $$MGMT_INDEX"; \
	else \
		echo "Could not auto-open browser (no open/xdg-open). Open the file manually."; \
	fi; \
	if [ "$$MGMT_EXIT" -ne 0 ]; then exit 1; fi

# Scoped report mode for both apps in one run. Requires WEB_SPEC and MGMT_SPEC.
# WEB_SPEC and MGMT_SPEC each support a single path or comma-separated paths; order is preserved (do not reorder).
# Runs API gate decision first, re-seeds both apps, captures step screenshots, writes timestamped reports, rotates to 10 runs.
e2e_test_report_scoped:
	@$(call e2e_run_api_gate)
	@$(MAKE) e2e_seed
	@if [ -z "$(WEB_SPEC)" ] || [ -z "$(MGMT_SPEC)" ]; then \
		echo "Missing WEB_SPEC or MGMT_SPEC."; \
		echo "Usage: make e2e_test_report_scoped WEB_SPEC=e2e/<web-spec>.spec.ts[,e2e/<web-spec>.spec.ts] MGMT_SPEC=e2e/<management-spec>.spec.ts[,e2e/<management-spec>.spec.ts]"; \
		exit 2; \
	fi
	@TS=$$(date +"%Y%m%d-%H%M%S"); \
	ROOT_DIR="$$(pwd)"; \
	BASE_DIR="$$ROOT_DIR/.artifacts/e2e-reports"; \
	RUN_DIR="$$BASE_DIR/$$TS"; \
	WEB_REPORT_DIR="$$RUN_DIR/web"; \
	MGMT_REPORT_DIR="$$RUN_DIR/management-web"; \
	mkdir -p "$$WEB_REPORT_DIR" "$$MGMT_REPORT_DIR"; \
	WEB_SPEC_ARGS=$$(printf "%s" "$(WEB_SPEC)" | tr ',' ' '); \
	MGMT_SPEC_ARGS=$$(printf "%s" "$(MGMT_SPEC)" | tr ',' ' '); \
	WEB_SPEC_ORDER_SEMICOLON=$$(printf "%s" "$(WEB_SPEC)" | tr ',' ';'); \
	MGMT_SPEC_ORDER_SEMICOLON=$$(printf "%s" "$(MGMT_SPEC)" | tr ',' ';'); \
	WEB_EXIT=0; E2E_STEP_SCREENSHOTS=true E2E_REPORT_SPEC="$(WEB_SPEC)" E2E_SPEC_ORDER="$$WEB_SPEC_ORDER_SEMICOLON" PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$WEB_REPORT_DIR" npm run test:e2e -w @boilerplate/web -- --reporter=../../scripts/e2e-html-steps-reporter.ts $$WEB_SPEC_ARGS || WEB_EXIT=$$?; \
	MGMT_EXIT=0; E2E_STEP_SCREENSHOTS=true E2E_REPORT_SPEC="$(MGMT_SPEC)" E2E_SPEC_ORDER="$$MGMT_SPEC_ORDER_SEMICOLON" PLAYWRIGHT_HTML_OPEN=never PLAYWRIGHT_HTML_OUTPUT_DIR="$$MGMT_REPORT_DIR" npm run test:e2e -w @boilerplate/management-web -- --reporter=../../scripts/e2e-html-steps-reporter.ts $$MGMT_SPEC_ARGS || MGMT_EXIT=$$?; \
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
	echo "Scoped E2E reports:"; \
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
