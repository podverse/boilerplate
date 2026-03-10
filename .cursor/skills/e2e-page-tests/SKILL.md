---
name: e2e-page-tests
description: When layout, functionality, or conditions change in apps/web or apps/management-web, add or update the corresponding E2E (Playwright) test so page behavior stays covered.
version: 1.1.0
---

# E2E Page Tests (Web and Management-Web)

When implementing a feature or plan that affects `apps/web` or `apps/management-web`, adding or updating E2E tests is a **required** part of the implementation, not optional.

Current E2E bar: **Confident**. Use this skill when you change **layout**, **functionality**, or **conditions** (e.g. redirects, auth checks, visibility, error states) in `apps/web` or `apps/management-web`. Always add or update an E2E test so the change is covered and regressions are caught.

## When to add or update a test

- **Layout changes** – New or moved sections, nav, headings, or structure on a page.
- **Functionality changes** – New or changed forms, buttons, links, or user flows (e.g. create bucket, edit message, login).
- **Condition changes** – New or changed redirects, auth guards, visibility rules, or error/empty states.

For CRUD and permission-gated flows, also apply **e2e-crud-state-matrix** and, for permission-gated pages, **e2e-permission-actor-matrix**.

If the change is in **web**, add or update a spec in `apps/web/e2e/`. If it is in **management-web**, add or update a spec in `apps/management-web/e2e/`.

## Where tests live

| App                 | Specs directory            | Config                                     |
| ------------------- | -------------------------- | ------------------------------------------ |
| apps/web            | `apps/web/e2e/`            | `apps/web/playwright.config.ts`            |
| apps/management-web | `apps/management-web/e2e/` | `apps/management-web/playwright.config.ts` |

- Use the **deterministic E2E seed** for data (e.g. `e2e@example.com` / `Test!1Aa` for web; `e2e-superadmin@example.com` for management-web). See [docs/testing/E2E-PAGE-TESTING.md](../../../docs/testing/E2E-PAGE-TESTING.md).
- **API gate**: E2E Make targets run API integration tests first; if they fail, Playwright does not run.
- **Current startup model**: Playwright `webServer` now auto-starts the required API + web apps on dedicated E2E ports in production-like mode (`build` + `start`), so manual app startup is not part of normal E2E runs.

## Rate limiting and auth in E2E

- **E2E runs get a clean API each time**: Each `make e2e_test*` (or Playwright run) starts fresh API/management-api processes, so rate-limit state is not carried over from previous runs. In test, default limits are very high (100k) unless `RATE_LIMIT_STRICT_FOR_TEST` is set, so E2E specs that log in a few times will not hit 429.
- **Avoid hitting 429 in E2E**: Do not add E2E flows that repeatedly submit login/signup/forgot-password (e.g. hundreds of requests in a loop). To assert 429 or rate-limit UI, use API integration tests (see api-testing skill; the dedicated rate-limit test files set the env and use dynamic import so real limits apply).

## Placeholder plans

Page-level coverage is tracked in `.llm/plans/active/e2e-page-tests/` (e.g. `web-03-dashboard.md`, `mgmt-06-bucket-detail.md`). When you add or expand a test for a page, consider updating the corresponding placeholder with the new scenarios or marking it as implemented.

## Quick reference

- **Run E2E (web only):** `make e2e_test_web`
- **Run E2E (management-web only):** `make e2e_test_management_web`.
- **Run E2E (both):** `make e2e_test`.
- **Run report-focused home smoke (auto-opens HTML reports, captures step screenshots):** `make e2e_test_home_report`.
- **Docs:** [docs/testing/E2E-PAGE-TESTING.md](../../../docs/testing/E2E-PAGE-TESTING.md).

Report mode uses a custom reporter (`scripts/e2e-html-steps-reporter.ts`) so each
step screenshot is shown with its full "Step description" in an expandable block
directly below the image.

## Screenshot naming policy (QA-readable)

When adding or updating screenshot steps in E2E specs:

- Use `actionAndCapture` / `capturePageLoad` from `e2e/helpers/stepScreenshots`.
- Keep screenshot capture report-focused (`E2E_STEP_SCREENSHOTS=true` runs such as `e2e_test_home_report`).
- **Use very descriptive step labels** that explain expected visible UI outcome, not short action codes.
- Prefer long, explicit labels over short ambiguous labels so QA can infer expected state from filename alone.

Good label examples:

- `navigate-to-home-route-and-expect-redirect-to-login-page-for-unauthenticated-user`
- `dashboard-screen-is-visible-with-primary-heading-after-successful-login`

Avoid labels like:

- `goto-home`
- `click-login`
