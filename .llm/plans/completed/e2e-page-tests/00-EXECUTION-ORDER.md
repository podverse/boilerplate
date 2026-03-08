# E2E Page Tests – Execution Order

## Phase 1: Foundation

- Complete `01-foundation.md`.
- Ensure runbook and Make flow are current, including reporting/artifact guidance.
- Confirm deterministic seed assumptions still match route coverage needs.

## Phase 2: Route audit + detailed-plan normalization

- Use App Router page files as source of truth:
  - `apps/web/src/app/**/page.tsx`
  - `apps/management-web/src/app/**/page.tsx`
- Ensure every active route has exactly one detailed plan file in
  `.llm/plans/completed/e2e-page-tests`.
- Keep deprecated topic-era placeholders out of active execution.

## Phase 3: Refine detailed plans where needed

- Follow `02-detailed-plan-generation.md`.
- Refine completed `web-*.md` and `mgmt-*.md` files when route behavior,
  fixture assumptions, or report-mode guidance changes.
- Prioritize high-risk CRUD and permission-heavy pages first.

## Phase 4: Implement tests in vertical slices

- **Web and management-web can run in parallel** once the affected detailed plans are current.
- For each page, implement Playwright coverage that matches its detailed plan.
- Keep PRs scoped by route clusters (auth, bucket CRUD, settings/roles, admin/users).

## Current state

- Route-level plan execution is complete for the current route baseline.
- Active plan work is now maintenance-only (runbook updates, mapping refresh, and
  documenting newly added routes before implementation).

## Suggested batch order (implementation)

1. Auth + dashboard smoke hardening (both apps)
2. Buckets list/detail/create/edit + messages CRUD
3. Settings/admin/roles flows
4. Users/admins/events management pages
5. Public/short-link and invite token pages

## Active sequencing notes

- Deprecated placeholders are documentation-only and should not be executed.
- `COPY-PASTA.md` provides prompts for safe parallel refinement and page-level implementation work.
