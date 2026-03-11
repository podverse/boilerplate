---
name: e2e-page-tests
description: When layout, functionality, or conditions change in apps/web or apps/management-web, add or update the corresponding E2E (Playwright) test so page behavior stays covered.
version: 1.2.0
---

# E2E Page Tests (Web and Management-Web)

Testing requirement policy lives in **feature-implementation-testing**. This skill focuses on **how** to add or update E2E coverage for web and management-web changes.

Current E2E bar: **Confident**. Use this skill when you change **layout**, **functionality**, or **conditions** (e.g. redirects, auth checks, visibility, error states) in `apps/web` or `apps/management-web`. Always add or update an E2E test so the change is covered and regressions are caught.

## When to add or update a test

- **Layout changes** – New or moved sections, nav, headings, or structure on a page.
- **Functionality changes** – New or changed forms, buttons, links, or user flows (e.g. create bucket, edit message, login).
- **Condition changes** – New or changed redirects, auth guards, visibility rules, or error/empty states.

For CRUD and permission-gated flows, also apply **e2e-crud-state-matrix** and, for permission-gated pages, **e2e-permission-actor-matrix**.
For query-param state behavior, also apply **e2e-url-state-contracts**.
For test-title/step readability and report behavior, also apply **e2e-readability**.

If the change is in **web**, add or update a spec in `apps/web/e2e/`. If it is in **management-web**, add or update a spec in `apps/management-web/e2e/`. When **adding** a new spec file, update the corresponding E2E spec order file so the full report stays in conceptual order (see **e2e-report-order** skill).

## Where tests live

| App                 | Specs directory            | Config                                     |
| ------------------- | -------------------------- | ------------------------------------------ |
| apps/web            | `apps/web/e2e/`            | `apps/web/playwright.config.ts`            |
| apps/management-web | `apps/management-web/e2e/` | `apps/management-web/playwright.config.ts` |

- Use the **deterministic E2E seed** for data (e.g. `e2e-bucket-owner@example.com` / `Test!1Aa` for web bucket-owner; management-web login is by username `e2e-superadmin` and password `Test!1Aa`). See [docs/testing/E2E-PAGE-TESTING.md](../../../docs/testing/E2E-PAGE-TESTING.md).
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
directly below the image; when the capture helper attaches a "Step URL", the report
shows that URL in the same block. The report UI includes a fixed top-right indicator
showing which test you are viewing (e.g. 3 / 12) and fixed bottom-right nav (prev/next
test, shot, error).

## Screenshot naming policy (QA-readable)

When adding or updating screenshot steps in E2E specs:

- Use `actionAndCapture` / `capturePageLoad` from `e2e/helpers/stepScreenshots`.
- Keep screenshot capture report-focused (`E2E_STEP_SCREENSHOTS=true` runs such as `e2e_test_home_report`).
- **Use very descriptive step labels** that explain expected visible UI outcome, not short action codes.
- Prefer long, explicit labels over short ambiguous labels so QA can infer expected state from filename alone.

Good label examples:

- `User navigates to the home route and is redirected to the login page for an unauthenticated session.`
- `The dashboard screen is visible with the primary heading after successful login.`

Avoid labels like:

- `goto-home`
- `click-login`
