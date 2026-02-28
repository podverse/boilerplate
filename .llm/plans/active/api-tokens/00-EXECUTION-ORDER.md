# API tokens for web app users – Execution Order

Run phases sequentially. Within a phase, run plan files in order unless marked parallel.

## Plan file location

All plans: `.llm/plans/active/api-tokens/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, dependency map, key decisions |
| [01-api-tokens-backend.md](01-api-tokens-backend.md) | DB, ORM, main API routes and auth middleware |
| [02-api-tokens-settings-ui.md](02-api-tokens-settings-ui.md) | Reusable UI in packages/ui; web + management-web settings |
| [03-api-tokens-shared-and-docs.md](03-api-tokens-shared-and-docs.md) | Shared types, i18n, skill, docs |

## Phase 1: Shared foundation

1. **03-api-tokens-shared-and-docs** (shared types and i18n only) – Add CRUD/permission types
   and main API resource list to `@boilerplate/helpers` (or shared package). Add i18n keys for
   API token section (apps only; apps pass strings as props to UI). Do not implement the
   skill or docs in this phase; do those in Phase 5.

   **Alternative:** Run all of 03 in Phase 1 and skip the Phase 5 skill/docs step; or run
   only shared types in Phase 1 and add a minimal “Phase 5: Skill and docs” step that
   references 03 Steps 3–5.

## Phase 2: Backend

2. **01-api-tokens-backend** – DB migration/init (api_token table), ORM entity and
   ApiTokenService, main API middleware (JWT vs API token, permission check), API routes
   (create, list, revoke), OpenAPI and validation. Depends on Phase 1 (shared types/resources).

## Phase 3: UI components

3. **02-api-tokens-settings-ui** (packages/ui only) – Build reusable components: permission
   form, one-time token result with copy button, token list, settings card. Add Storybook
   stories if needed. Depends on Phase 1 (i18n keys).

## Phase 4: Integration

4. **02-api-tokens-settings-ui** (apps integration) – Wire apps/web settings page to the
   shared API token card and main API. Optionally wire apps/management-web settings page
   (same component, placeholder or main API base). Depends on Phase 2 and Phase 3.

## Phase 5: Docs and skills

5. **03-api-tokens-shared-and-docs** (skill and docs) – Add `.cursor/skills/api-tokens/SKILL.md`,
   add `docs/api/API-TOKENS.md`, update AGENTS.md if needed. Can be done in parallel with
   final verification of Phase 4.

## Rules

- Phases are sequential; do not start Phase N+1 until Phase N is complete.
- Within a phase, complete each step before the next.
- Do not implement until the user asks; execute the plan incrementally (e.g. phase by phase).

**Optional:** For parallel execution (e.g. multiple agents), add a COPY-PASTA.md with
copy-paste prompts for Phase 3 (UI components) and Phase 4 (integration), and reference it
here; otherwise the sequential phase list above is sufficient.
