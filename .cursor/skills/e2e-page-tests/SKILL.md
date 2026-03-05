---
name: e2e-page-tests
description: When layout, functionality, or conditions change in apps/web or apps/management-web, add or update the corresponding E2E (Playwright) test so page behavior stays covered.
version: 1.0.0
---

# E2E Page Tests (Web and Management-Web)

Use this skill when you change **layout**, **functionality**, or **conditions** (e.g. redirects, auth checks, visibility, error states) in `apps/web` or `apps/management-web`. Always add or update an E2E test so the change is covered and regressions are caught.

## When to add or update a test

- **Layout changes** – New or moved sections, nav, headings, or structure on a page.
- **Functionality changes** – New or changed forms, buttons, links, or user flows (e.g. create bucket, edit message, login).
- **Condition changes** – New or changed redirects, auth guards, visibility rules, or error/empty states.

If the change is in **web**, add or update a spec in `apps/web/e2e/`. If it is in **management-web**, add or update a spec in `apps/management-web/e2e/`.

## Where tests live

| App                 | Specs directory            | Config                                     |
| ------------------- | -------------------------- | ------------------------------------------ |
| apps/web            | `apps/web/e2e/`            | `apps/web/playwright.config.ts`            |
| apps/management-web | `apps/management-web/e2e/` | `apps/management-web/playwright.config.ts` |

- Use the **deterministic E2E seed** for data (e.g. `e2e@example.com` / `Test!1Aa` for web; `e2e-superadmin@example.com` for management-web). See [docs/testing/E2E-PAGE-TESTING.md](../../../docs/testing/E2E-PAGE-TESTING.md).
- **API gate**: E2E Make targets run API integration tests first; if they fail, Playwright does not run. Run `make e2e_test_web` or `make e2e_test_management_web` (or `make e2e_test` for both) after `make e2e_deps` and `make e2e_seed`; start the app and API (and sidecar for web) before Playwright.

## Placeholder plans

Page-level coverage is tracked in `.llm/plans/active/e2e-page-tests/` (e.g. `web-03-dashboard.md`, `mgmt-06-bucket-detail.md`). When you add or expand a test for a page, consider updating the corresponding placeholder with the new scenarios or marking it as implemented.

## Quick reference

- **Run E2E (web only):** `make e2e_test_web` (after deps, seed, and with API + web running).
- **Run E2E (management-web only):** `make e2e_test_management_web`.
- **Run E2E (both):** `make e2e_test`.
- **Docs:** [docs/testing/E2E-PAGE-TESTING.md](../../../docs/testing/E2E-PAGE-TESTING.md).
