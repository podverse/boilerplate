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
   API token section. Do not implement the skill or docs in this phase if you prefer to do them
   in Phase 5; or run the full 03 and do skill + docs in Phase 5 as a separate step.

   **Alternative:** Run **03** fully in Phase 5 (docs and skill). Then Phase 1 is “add shared
   types and constants only” (extract from 03 or add a small section in 01 that defines
   types in helpers first). For clarity, this execution order assumes:
   - Phase 1: Run **03** for “Shared types/constants” and “i18n keys” sections only.
   - Phase 5: Run **03** for “Skill” and “Documentation” sections (or add those steps to 03
     and run 03 once in Phase 1 with all sections).

   **Recommended:** Run **03** once at the start of Phase 1 for shared types + i18n; run the
   “Skill” and “Documentation” parts of 03 at the end in Phase 5.

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
