# E2E Page Tests – Summary

## Scope

Keep active E2E page-test plans aligned with the current App Router surface in
`apps/web` and `apps/management-web`. Placeholder page plans stay concise now.
Before implementation, each page will get a dedicated detailed plan covering
layout, values, functionality, permissions, and CRUD behavior in depth.

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
| 02-detailed-plan-generation.md | Template/process for generating implementation-grade page plans later |
| 03-route-to-plan-map.md | Canonical mapping of current routes to active placeholder plans |
| COPY-PASTA.md | Copy-paste prompts for parallel page-plan detailing and implementation |
| `web-*.md` | Web placeholder plans for each current route |
| `mgmt-*.md` | Management-web placeholder plans for each current route |

## Deprecated route tracking

Topic-era placeholders were removed from the active plan set in this refresh and
must not be reintroduced unless those routes return to App Router.

## Placeholder policy

For this refresh, per-page files remain concise and should include:

- Route + page intent
- Key scenario buckets (layout, auth/permission, core interactions, CRUD if any)
- Primary files to touch later (page, components, spec path)
- Verification notes
- `Detailed plan to be generated before implementation` section

## Cross-cutting requirements for future detailed plans

- Deterministic value assertions from seeded data
- Layout structure assertions (headings, sections, key controls, empty/loading states)
- Permission and redirect branches
- CRUD matrix (create/read/update/delete + validation + cancel/confirm flows)
- Flake-resistance checks (load timing, idempotent submit, refresh/back behavior)
- Accessibility smoke checks (keyboard path + focusable primary actions)
- Screenshot/trace expectations for failures and targeted visual checkpoints

## Reporting + visual review baseline

Primary recommended stack is Playwright native reporting:

- HTML report for human-readable pass/fail plus per-test context
- Trace Viewer for step-level inspection
- Retained screenshots/videos on failures for QA visual confirmation

Optional future extension: Allure if cross-run dashboarding/analytics becomes
necessary.

## Reference

- [docs/testing/E2E-PAGE-TESTING.md](../../../../docs/testing/E2E-PAGE-TESTING.md)
