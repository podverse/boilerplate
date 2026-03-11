---
name: e2e-report-order
description: Maintain E2E spec order for full reports and respect parameter order for specified runs.
version: 1.0.0
---

# E2E Report Order

Use this skill when working with E2E report ordering: full-suite reports (`make e2e_test_report`) or scoped runs with `SPEC` / `WEB_SPEC` / `MGMT_SPEC`.

## 1. Master order for full report

The full E2E report (`make e2e_test_report`) displays tests in **conceptual order** so the HTML report is easier to review (e.g. home first, then buckets list/detail/settings, then events/users/admins). Playwright may run spec files in its own order (e.g. alphabetical); when `E2E_SPEC_ORDER` is set (as the Makefile does from the order files), the custom HTML reporter reorders `this.runs` for display so the report reflects the intended order.

- **Order files** (single source of truth):
  - `makefiles/local/e2e-spec-order-web.txt` — one spec path per line (e.g. `e2e/home-unauthenticated.spec.ts`) for apps/web.
  - `makefiles/local/e2e-spec-order-management-web.txt` — same for apps/management-web.
- **When adding a new E2E spec**: Add it to the appropriate order file in the **right conceptual place** (e.g. home specs first, then buckets list, bucket detail, bucket settings, bucket messages, bucket admin edit, etc.). Do not append at the end unless that is the right place; insert in the logical group.
- **When removing a spec**: Remove its line from the corresponding order file so the full report does not reference a missing file.
- **Comments**: Lines starting with `#` and blank lines in the order files are ignored when building the spec list.

## 2. Specified runs (parameter order)

When running one or more specs via `e2e_test_web_report_spec`, `e2e_test_management_web_report_spec`, or `e2e_test_report_scoped` with multiple comma-separated paths:

- The Makefile sets `E2E_SPEC_ORDER` from the parameter (comma → semicolon); the reporter reorders runs for display so the report shows tests in **the same order as the parameter** (SPEC, WEB_SPEC, or MGMT_SPEC), even if Playwright runs specs in a different order.
- **Do not sort or reorder** the spec list when suggesting or generating make commands. Pass specs in the order the user or scenario expects for review.

## Reference

- Order semantics are documented in [docs/testing/E2E-PAGE-TESTING.md](../../../docs/testing/E2E-PAGE-TESTING.md) under "Report order".
- The custom reporter (`scripts/e2e-html-steps-reporter.ts`) reads `E2E_SPEC_ORDER` (semicolon-separated spec paths) in `onEnd` and sorts `this.runs` by that order before generating the HTML, so report display matches the intended order regardless of Playwright execution order.
