---
name: response-ending-make-verify
description: End implementation responses with scoped make-based screenshot report commands for web and management-web verification.
version: 1.0.0
---

# Response-Ending Make Verification

The Cursor rule `end-with-targeted-make-report-verify` enforces this behavior; this skill is the extended reference (command tree, API gate, multi-spec).

Use this skill when answering implementation requests in this repo.

## Required response behavior

1. End every implementation response with one or more runnable `make` commands.
2. Prefer feature-scoped screenshot report commands over full-suite commands.
3. Choose the smallest command set that verifies the changed behavior.
4. Only recommend full-suite report mode when scope is broad or cross-cutting.
5. Render final verification commands inside a fenced `bash` code block so the UI shows a copy button.
6. Inside the fenced block, keep one command per line and avoid bullets/backticks.

## Command selection decision tree

- Web-only feature (single page/flow):
  - `make e2e_test_web_report_spec SPEC=e2e/<web-spec>.spec.ts`
- Management-web-only feature (single page/flow):
  - `make e2e_test_management_web_report_spec SPEC=e2e/<management-spec>.spec.ts`
- Cross-app feature touching both web and management-web:
  - `make e2e_test_report_scoped WEB_SPEC=e2e/<web-spec>.spec.ts MGMT_SPEC=e2e/<management-spec>.spec.ts`
- Lightweight broad smoke check:
  - `make e2e_test_home_report`
- Broad regression or pre-deploy confidence:
  - `make e2e_test_report`

## API gate mode selection

- `E2E_API_GATE_MODE=auto` (default): fastest path; runs API gate only when changed files
  look API-impacting.
- Use `E2E_API_GATE_MODE=on` when changes may affect API behavior, data shape, auth,
  seed setup, or shared backend/domain packages.
- Use `E2E_API_GATE_MODE=off` only when you intentionally want maximum speed and accept
  skipping API integration tests.

Examples:

- Web scoped with strict gate:
  - `make E2E_API_GATE_MODE=on e2e_test_web_report_spec SPEC=e2e/<web-spec>.spec.ts`
- Management scoped with strict gate:
  - `make E2E_API_GATE_MODE=on e2e_test_management_web_report_spec SPEC=e2e/<management-spec>.spec.ts`
- Cross-app scoped with strict gate:
  - `make E2E_API_GATE_MODE=on e2e_test_report_scoped WEB_SPEC=e2e/<web-spec>.spec.ts MGMT_SPEC=e2e/<management-spec>.spec.ts`

Multi-spec input:

- `SPEC`, `WEB_SPEC`, and `MGMT_SPEC` support comma-separated values.
- Example:
  - `make e2e_test_web_report_spec SPEC=e2e/buckets.spec.ts,e2e/invite.spec.ts`
  - `make e2e_test_report_scoped WEB_SPEC=e2e/buckets.spec.ts,e2e/bucket-detail.spec.ts MGMT_SPEC=e2e/buckets.spec.ts,e2e/events.spec.ts`

## Notes

- These report-mode targets capture step screenshots and write timestamped HTML reports in `.artifacts/e2e-reports/`.
- API gate behavior is controlled by `E2E_API_GATE_MODE`; default `auto` is intended for
  fast day-to-day feedback.
- If a response includes non-UI/API-internal work, still end with the nearest relevant verification command and briefly explain why it is the best available check.
- If a verification command requires interactive input, stop and hand off using the **interactive-prompts** skill.
