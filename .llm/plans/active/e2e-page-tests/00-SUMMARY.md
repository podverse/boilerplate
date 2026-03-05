# E2E Page Tests – Summary

## Scope

End-to-end tests for every page in apps/web and apps/management-web: layout and key interactions (without infinite loops), with deterministic outcomes via E2E seed data. API integration tests must pass before any web/management-web E2E run.

## Plan files

| File | Purpose |
|------|--------|
| 00-EXECUTION-ORDER.md | Phase order and pointers |
| 00-SUMMARY.md | This file |
| 01-foundation.md | Foundation: docs, Make, seed, Playwright, one test per app |
| web-02-home.md … web-25-reset-password.md | Web app page placeholders (24 pages) |
| mgmt-02-home.md … mgmt-26-login.md | Management-web page placeholders (25 pages) |

Each placeholder will be expanded later with concrete steps, selectors, and assertions.

## Cross-cutting considerations (gaps to cover in plans)

When expanding each page plan into concrete steps, consider adding coverage for:

- **Initial load / timing:** For pages that fetch data, assert after load completes (wait for loading indicator/skeleton to disappear or for content to appear) to avoid flaky assertions; document any loading UI (spinner/skeleton) to test.
- **URL and refresh:** For list/detail pages with search, filter, or pagination: refreshing the page preserves query params and list state; deep links (direct URL to a page with params) work.
- **Double submit / idempotency:** On create/edit forms, double-click or rapid double submit results in only one create/update (button disabled or request deduplicated); no duplicate record.
- **Browser back:** After opening a form, browser back does not crash; after successful submit, browser back has expected behavior (e.g. no duplicate submit; confirm form or redirect).
- **Delete flows:** Where delete exists: confirmation dialog shown; cancel leaves entity unchanged; confirm performs delete and list/detail updates (entity removed or redirect).
- **Accessibility:** Primary actions (submit, primary links) focusable and activatable via keyboard; form inputs have associated labels; modal/dialog focus management where applicable.
- **Responsive / viewport (optional):** Key breakpoints (e.g. mobile, tablet) for nav, tables, and forms so layout does not break; or document desktop-only if that is product scope.
- **Localization (optional):** When the app supports multiple locales, test critical pages (login, errors, invite) with an alternate locale and assert labels/errors are translated.
- **Sensitive data:** No password or token echoed in DOM, in URL (except where required, e.g. invite/reset token in path), or in error message text; session cookie attributes (e.g. HttpOnly) are app responsibility but avoid asserting on raw tokens in UI.
- **Invalid IDs:** For routes using short_id or numeric id: invalid format (wrong length, invalid chars) yields 404 or validation error, not 500.
- **Role / permission scope (management):** As super admin vs non–super admin: nav and list data scoped by admin_permissions and event_visibility; document expected visibility per role where relevant.

## Reference

- [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md) – Flow, Make targets, ports, seed.
