# Plan 25: LLM alignment – skills, rules, and AGENTS.md

## Scope

Add and update **skills**, **cursor rules**, and **AGENTS.md** (or equivalent) so that LLMs
are reminded to keep related artifacts in sync. When one part of the system changes (e.g. API
routes, env vars, DB schema), the corresponding docs, schemas, and config should be updated
in the same flow. This phase does not implement features; it wires guidance that reduces
drift.

## Goals

- **API ↔ OpenAPI**: When endpoints or request/response shapes change, the OpenAPI spec
  (and thus Swagger UI) is updated so /api-docs stays accurate and testable.
- **Env ↔ validation ↔ templates**: When env vars are added or changed, startup validation
  and .env.example (and infra config templates) are updated.
- **Routes ↔ Joi ↔ auth**: New or changed routes have matching Joi validation and, if
  protected, use auth middleware and are documented with security in OpenAPI.
- **DB schema ↔ ORM ↔ init script**: When TypeORM entities or columns change, the init
  script in infra/database is updated (Option A schema approach).
- **i18n**: When user-facing strings or new pages are added, translation keys are added for
  all locales and components use t().
- **Valkey keys**: When new Redis/Valkey key patterns are introduced, they are documented
  (e.g. in architecture or OpenAPI description) so usage stays consistent.
- **Docs**: When setup, env, or architecture changes, README and docs/ are updated.
- **Workspaces**: When new packages or apps are added, root workspaces and build order are
  updated.

## Steps

1. **API + OpenAPI alignment**
   - **Skill** (e.g. `.cursor/skills/api-openapi-sync/SKILL.md`): “When adding, changing, or
     removing API routes or request/response shapes in apps/api, update the OpenAPI spec
     (e.g. apps/api/openapi.yaml or the path used by plan 24) so that paths, request bodies,
     responses, and security match. Verify /api-docs (Swagger UI) reflects the change.”
   - Optionally a **cursor rule** with glob `apps/api/**/*.ts` (routes, controllers) that
     says: “If you modified route definitions or request/response types, update the OpenAPI
     spec and confirm /api-docs is accurate.”

2. **Env vars alignment**
   - **Skill** or **rule**: “When adding or changing environment variables used by any app
     or package, update: (1) the app’s .env.example (or infra/config/env-templates), (2)
     startup validation (e.g. packages/helpers or apps/api/lib/startup/validation.ts) so the
     new var is validated or documented as optional.” Reference existing env-file-formatting
     rule for .env format.
   - Ensure AGENTS.md or the skill mentions infra/config/env-templates and apps/api/.env.example.

3. **Routes, Joi, and auth**
   - **Skill** (e.g. extend api skill or add `api-routes-validation/SKILL.md`): “When adding
     a new API route that accepts a body: add or update a Joi schema and validate before
     handler logic. When adding a protected route: use the auth middleware and document the
     route in OpenAPI with the appropriate security (e.g. bearerAuth).”

4. **DB schema and init script**
   - **Skill** or **rule**: “When adding or changing TypeORM entities or columns in
     packages/orm (or apps that define entities), update the init script used by Postgres
     (e.g. infra/database/combined/init_database.sql) so the schema matches. This repo
     uses init-script schema (Option A), not TypeORM migrations.”
   - Trigger: when editing under packages/orm/src/entities or the init script path.

5. **i18n alignment**
   - **Skill** (e.g. `.cursor/skills/i18n-sync/SKILL.md`): “When adding or changing
     user-facing strings in apps/web, or when adding a new page or modal: add or update
     translation keys in all locale files (e.g. messages/en.json, messages/es.json) and use
     the i18n hook (e.g. useTranslations, t()) in the component. Do not leave hardcoded
     strings that should be translated.”

6. **Valkey key patterns**
   - **Skill** or **rule**: “When introducing new Valkey/Redis key patterns in apps/api (or
     elsewhere), document the key layout (e.g. messages:{userId}) in the OpenAPI spec
     (description), docs/ARCHITECTURE.md, or a short comment in the module. Keep key
     naming consistent to avoid collisions and confusion.”

7. **Documentation**
   - **Skill** or **rule**: “When changing how the repo is set up (install, run, docker,
     env), or when architecture or data flow changes: update README, docs/DEVELOPMENT.md,
     docs/INFRASTRUCTURE.md, or docs/ARCHITECTURE.md as appropriate. Keep the docs/ index
     or README links accurate.”

8. **AGENTS.md alignment section**
   - Add a section to **AGENTS.md** (e.g. “LLM alignment – keep these in sync”) that lists
     the above as a short checklist or table: “When you change X, also update Y.” This
     gives a single place for humans and LLMs to see cross-cutting obligations. Optionally
     link to the relevant skills from this section.

9. **Workspace and build order**
   - **Skill** or AGENTS.md note: “When adding a new package under packages/ or a new app
     under apps/, add it to root package.json workspaces. If the new package is a
     dependency of others, document or preserve build order (e.g. helpers before orm) in
     README or scripts.”

10. **Optional: one-pager for “before you change”**
    - Optionally add a short doc (e.g. `.llm/context/alignment-checklist.md` or a section
      in AGENTS.md) that an LLM can read when about to modify a given area: “Changing API
      routes? Update OpenAPI and Joi. Changing env? Update validation and .env.example.”
      Keep it to one page so it stays usable.

## Key files

- `.cursor/skills/api-openapi-sync/SKILL.md` (or merged into api skill)
- `.cursor/skills/api-routes-validation/SKILL.md` or extension of api skill
- `.cursor/skills/env-validation-sync/SKILL.md` (or rule)
- `.cursor/skills/orm-init-sync/SKILL.md` (or rule)
- `.cursor/skills/i18n-sync/SKILL.md`
- Optional: `.cursor/rules/*.mdc` for glob-triggered reminders (e.g. when editing
  openapi.yaml, when editing entities)
- `AGENTS.md` – new section “LLM alignment – keep these in sync” with table or list
- Optional: `.llm/context/alignment-checklist.md`

## Verification

- After adding skills/rules: when an LLM is given a prompt that implies “add a new API
  endpoint,” the relevant skill or rule is in scope (or AGENTS.md is updated) so the
  model is reminded to update OpenAPI and validation.
- AGENTS.md contains the alignment section and points to the right skills or rules.
- No duplicate or conflicting guidance across skills and rules; keep descriptions short
  and actionable.

## Dependencies

- Run after plans that create the artifacts being aligned: OpenAPI (24), validation
  (11/05), env templates (01), ORM and init script (12), i18n (21). So run **after Phase 9**
  (or after Phase 8 if OpenAPI is done) so the repo already has OpenAPI, helpers, orm,
  init script, and i18n in place. Plan 25 is the **final phase** (Phase 10).
