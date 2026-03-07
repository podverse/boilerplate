# E2E Page Tests – Foundation

## Scope

Foundation for running comprehensive E2E page tests: documentation, Make target
orchestration, deterministic fixtures, Playwright startup/reporting behavior,
token/setup policy for one-time links, and isolation rules for mutating specs.

## Deliverables

- **Docs**: [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md) as the canonical operator runbook.
- **Make + Playwright orchestration**: dependency setup, API gate, seed flows, smoke runs, and report-mode runs.
- **Deterministic seed scripts**:
  - `tools/web/seed-e2e.mjs`
  - `tools/management-web/seed-e2e.mjs`
- **Canonical detailed plan set**: current `web-*.md` and `mgmt-*.md` files are the detailed plans used for implementation; they are not lightweight placeholders anymore.
- **Reporting baseline**: HTML report, traces, retained failure media, timestamped report bundles, latest symlink, and step screenshots in report mode.

## Canonical fixture matrix

### Web seed (`tools/web/seed-e2e.mjs`)

- One main-app user:
  - email: `e2e@example.com`
  - password: `Test!1Aa`
  - display name: `E2E User`
- Two top-level buckets:
  - `E2E Bucket One` (`isPublic: true`)
  - `E2E Bucket Two` (`isPublic: false`)
- No child bucket is created by default in the current seed.

### Management-web seed (`tools/management-web/seed-e2e.mjs`)

- One management super admin only:
  - username: `e2e-superadmin`
  - password: `Test!1Aa`
  - display name: `E2E Super Admin`
- No scoped/non-super-admin fixture is created by default.
- No extra permission-matrix admins are created by default.

### Implication for detailed page plans

- Any page plan that requires child buckets, bucket admins beyond the owner,
  custom bucket roles, scoped admins, or event-visibility branches must call out
  helper-created fixtures or API-created setup rather than pretending the seed
  already provides them.

## Token and one-time-link strategy

- Do not rely on seed data for invite, reset-password, email-change, or similar
  one-time tokens.
- Preferred strategy:
  1. create prerequisite entities through API helpers or setup calls,
  2. obtain the token from a test-only helper, captured mail output, or a
     deterministic setup endpoint when available,
  3. keep the token acquisition method documented once in the runbook and
     referenced from page plans.
- Page plans should say whether a token comes from:
  - API/setup helper
  - captured mail artifact
  - explicit test-only fixture creation

## Mutation and isolation policy

- Read-only specs should prefer seeded fixtures.
- Create/update/delete specs must use uniquely named fixtures or per-test setup
  helpers so runs stay parallel-safe.
- Destructive specs must not permanently mutate shared seed rows that later specs
  depend on.
- When a destructive scenario must touch a seeded entity, the plan must call out
  required cleanup or a per-file reseed/setup boundary.
- Parallel implementation prompts must treat mutating specs as isolated by
  helper-created fixtures unless explicitly documented otherwise.

## Permission-matrix policy

- Management-web permission and `event_visibility` branches are mandatory where
  relevant; they are not optional nice-to-haves.
- Because the default management seed only includes one super admin, scoped-admin
  branches require explicit helper-created fixtures.

## Reporting strategy (open source)

Primary recommendation:

- Playwright HTML report (`reporter: [['list'], ['html', { open: 'never' }]]`)
- `trace: 'retain-on-failure'`
- `screenshot: 'only-on-failure'` for normal runs
- step screenshots enabled in report-mode runs
- `video: 'retain-on-failure'`

This provides pass/fail context per test, direct links to artifacts, and visual
evidence for QA review. Optional future extension: Allure for richer cross-run
history and dashboards.

## Full-suite report-mode expectation

- The current built-in report command is `make e2e_test_home_report`.
- Future route-cluster or full-suite report commands should reuse the same model:
  timestamped run directory, per-app subfolders, report attachments, step
  screenshots, rotation, and `latest` symlink.
- Detailed page plans can assume that report-mode runs should attach named step
  screenshots and traces for QA review.

## Verification

- `make e2e_deps` brings up test DBs; `make e2e_seed` runs without error.
- `make e2e_test_api` runs API tests before Playwright.
- `make e2e_test_web`, `make e2e_test_management_web`, and report-mode variants
  use the documented seed and artifact model.
- Shared docs and page plans reference the real seed state instead of outdated
  assumptions like “one child bucket” or “multiple scoped admins” unless they
  also document helper-created fixtures.
