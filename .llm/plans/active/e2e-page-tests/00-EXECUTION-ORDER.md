# E2E Page Tests – Execution Order

## Phase 1: Foundation

- Complete `01-foundation.md`.
- Ensure runbook and Make flow are current, including reporting/artifact guidance.
- Confirm deterministic seed assumptions still match route coverage needs.

## Phase 2: Route audit + placeholder normalization

- Use App Router page files as source of truth:
  - `apps/web/src/app/**/page.tsx`
  - `apps/management-web/src/app/**/page.tsx`
- Ensure every active route has exactly one active placeholder plan.
- Keep deprecated topic-era placeholders out of active execution.

## Phase 3: Generate detailed implementation plans (future)

- Follow `02-detailed-plan-generation.md`.
- For each placeholder file, generate an implementation-grade plan before coding.
- Prioritize high-risk CRUD and permission-heavy pages first.

## Phase 4: Implement tests in vertical slices

- **Web and management-web can run in parallel** once Phase 3 plans exist.
- For each page, implement Playwright coverage that matches its detailed plan.
- Keep PRs scoped by route clusters (auth, bucket CRUD, settings/roles, admin/users).

## Suggested batch order (implementation)

1. Auth + dashboard smoke hardening (both apps)
2. Buckets list/detail/create/edit + messages CRUD
3. Settings/admin/roles flows
4. Users/admins/events management pages
5. Public/short-link and invite token pages

## Active sequencing notes

- Deprecated placeholders are documentation-only and should not be executed.
- `COPY-PASTA.md` provides prompts for safe parallel execution of page-level work.
