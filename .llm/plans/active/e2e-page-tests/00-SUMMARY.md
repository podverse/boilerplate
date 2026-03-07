# E2E Page Tests – Summary

## Scope

Keep active E2E page-test plans aligned with the current App Router surface in
`apps/web` and `apps/management-web`. Every current route has a corresponding
plan file; each has been expanded into a **detailed plan** with selector
strategy, assertion matrix (layout, auth/redirect, values, interaction),
CRUD where applicable, test data mapping, screenshot/trace checkpoints, and
verification commands so implementation can proceed without additional
product-guessing.

## Current route baseline

### Web routes (`apps/web/src/app/**/page.tsx`)

- Auth: `/login`, `/signup`, `/forgot-password`, `/reset-password`
- Main: `/`, `/dashboard`, `/buckets`, `/buckets/new`, `/profile`, `/settings`
- Dynamic: `/invite/[token]`, `/bucket/[id]`, `/bucket/[id]/new`,
  `/bucket/[id]/bucket/new`, `/bucket/[id]/messages`,
  `/bucket/[id]/messages/[messageId]/edit`, `/bucket/[id]/settings`,
  `/bucket/[id]/settings/admins/[userId]/edit`,
  `/bucket/[id]/settings/roles/new`,
  `/bucket/[id]/settings/roles/[roleId]/edit`
- Short/public: `/b/[id]`, `/b/[id]/send-message`

### Management-web routes (`apps/management-web/src/app/**/page.tsx`)

- Auth/entry: `/login`, `/`, `/dashboard`
- Admin/account: `/profile`, `/settings`, `/events`, `/admins`, `/admins/new`,
  `/admins/roles/new`, `/admin/[id]`, `/admin/[id]/edit`
- Users: `/users`, `/users/new`, `/user/[id]`, `/user/[id]/edit`
- Buckets/messages/settings: `/buckets`, `/buckets/new`, `/bucket/[id]`,
  `/bucket/[id]/edit`, `/bucket/[id]/new`, `/bucket/[id]/messages`,
  `/bucket/[id]/messages/[messageId]/edit`, `/bucket/[id]/settings`,
  `/bucket/[id]/settings/admins/[userId]/edit`,
  `/bucket/[id]/settings/roles/new`,
  `/bucket/[id]/settings/roles/[roleId]/edit`

## Plan files

| File | Purpose |
| ---- | ------- |
| 00-EXECUTION-ORDER.md | Phase order and sequencing |
| 00-SUMMARY.md | Scope, route baseline, and mapping notes |
| 01-foundation.md | Foundation: runbook, Make targets, deterministic data, reporting baseline |
| 02-detailed-plan-generation.md | Guidance for refining and maintaining the current implementation-grade page plans |
| 03-route-to-plan-map.md | Canonical mapping of current routes to active placeholder plans |
| COPY-PASTA.md | Copy-paste prompts for parallel page-plan detailing and implementation |
| `web-*.md` | Web detailed plans for each current route (layout, auth, CRUD, selectors, test data) |
| `mgmt-*.md` | Management-web detailed plans for each current route (layout, auth, permissions, CRUD, selectors, test data) |

## Deprecated route tracking

Topic-era placeholders were removed from the active plan set in this refresh and
must not be reintroduced unless those routes return to App Router.

## Detailed plan content (per page)

Each `web-*.md` and `mgmt-*.md` file is a **detailed plan** (not a stub or lightweight placeholder) and includes:

- Route and objective
- Selector strategy (roles, labels, stable selectors)
- Assertion matrix: layout, auth/redirect conditions, values/display, interaction
- CRUD matrix where applicable (create/read/update/delete + validation + cancel)
- Edge/error states
- Test data mapping (seeded IDs, users, permission branches)
- Screenshot and trace checkpoints
- Verification commands (Make targets)
- Implementation notes (spec path, page path, test case list)

Conditional UI (hidden, disabled, visibility by permission), different users/admins,
and CRUD permissions are called out so tests can be bulletproof as development continues.

## Cross-cutting requirements for detailed plans

- Deterministic value assertions from seeded data
- Layout structure assertions (headings, sections, key controls, empty/loading states)
- Permission and redirect branches
- CRUD matrix (create/read/update/delete + validation + cancel/confirm flows)
- Flake-resistance checks (load timing, idempotent submit, refresh/back behavior)
- Accessibility smoke checks: primary actions (submit, primary links) focusable; tab order reasonable; optional: Enter submits form, Escape closes modal/cancel
- Submit loading: on form-based plans, assert primary button disabled or shows loading during request and re-enables after success or error (no stuck loading)
- Screenshot/trace expectations for failures and targeted visual checkpoints

## Fixture and setup assumptions

- Web seed currently provides one user (`e2e@example.com`) and two top-level buckets only.
- Management seed currently provides one super admin (`e2e-superadmin`) only.
- Child buckets, scoped admins, permission-matrix admins, invite tokens, and reset-password tokens must be created through helper/setup flows when a page plan depends on them.

## Isolation expectations

- Read-only plans should prefer seeded fixtures.
- Mutating/destructive plans must call out unique fixture creation or reseed/setup boundaries so later specs are not poisoned.
- Management-web permission and `event_visibility` branches are mandatory where relevant, even when they require helper-created fixtures beyond the default seed.

## Reporting + visual review baseline

Primary recommended stack is Playwright native reporting:

- HTML report for human-readable pass/fail plus per-test context
- Trace Viewer for step-level inspection
- Retained screenshots/videos on failures for QA visual confirmation

Optional future extension: Allure if cross-run dashboarding/analytics becomes
necessary.

## Reference

- [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)
