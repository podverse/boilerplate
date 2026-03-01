# Boilerplate – Summary

## Scope

- Align boilerplate monorepo with podverse structure as a **hello-world boilerplate**.
- **Features**: signup, login, post messages, real-time dashboard; messages in Valkey, auth in
  Postgres; privacy toggle (messages visible only to user unless “viewable by anyone”).
- **Optional:** Management API and Management Web — fully separate from main API/web; admin
  powers (super admin + scoped admins), audit events, Events page. React components and
  styles shared via a **shared UI package** (`packages/ui` / `@boilerplate/ui`) used by
  both web and management-web.
- **Out of scope**: deployment (no k8s). Alpha publish: images built and pushed to registry
  (e.g. GHCR) when merging to `alpha`.
- **Style**: Minimal; functionality and clarity.

## Plan files (35 topics + 2 meta)

| ID | File | Phase |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Meta |
| – | 00-SUMMARY.md | Meta |
| 01 | 01-infra-directory.md | 1 (completed) |
| 02 | 02-docker-files.md | 1 (completed) |
| 03 | 03-add-postgres.md | 1 (completed) |
| 04 | 04-add-valkey.md | 1 (completed) |
| 05 | 05-validate.md | 2 (completed) |
| 06 | 06-audit.md | 2 (completed) |
| 07 | 07-bump-version.md | 2 (completed) |
| 08 | 08-makefiles.md | 2 (completed) |
| 09 | 09-gitflow-test.md | 3 (completed) |
| 10 | 10-git-labels.md | 3 (completed) |
| 11 | 11-helpers-package.md | 4 (completed) |
| 12 | 12-orm-package.md | 4 (completed) |
| 13 | 13-alpha-publish-stub.md | 5 (completed) |
| 14 | 14-joi-validation.md | 6 (completed) |
| 15 | 15-auth-handling.md | 6 (completed) |
| 16 | [16-scss.md](../../completed/boilerplate/16-scss.md) | 7 (completed) |
| 17 | [17-responsive-layout.md](../../completed/boilerplate/17-responsive-layout.md) | 7 (completed) |
| 18 | [18-themes.md](../../completed/boilerplate/18-themes.md) | 7 (completed) |
| 19 | [19-basic-components.md](../../completed/boilerplate/19-basic-components.md) | 7 (completed) |
| 20 | [20-settings-page.md](../../completed/boilerplate/20-settings-page.md) | 7 (completed) |
| 21 | [21-i18n-translations.md](../../completed/boilerplate/21-i18n-translations.md) | 7 (completed) |
| 22 | 22-dashboard-realtime.md | 7 |
| 23 | 23-documentation-diagrams.md | 9 |
| 24 | [24-openapi-docs.md](../../completed/boilerplate/24-openapi-docs.md) | 8 (completed) |
| 25 | [25-llm-alignment-skills-rules.md](../../completed/boilerplate/25-llm-alignment-skills-rules.md) | 10 (completed) |
| 26 | 26-git-hooks.md | 11 |
| 27 | [27-project-description.md](../../completed/boilerplate/27-project-description.md) | 12 (completed) |
| 28 | [28-github-repo-setup.md](../../completed/boilerplate/28-github-repo-setup.md) | 13 (completed) |
| 29 | [29-dependabot.md](../../completed/boilerplate/29-dependabot.md) | 14 (completed) |
| 30 | 30-jenkins-local.md | 15 |
| 31 | [31-management-database.md](../../completed/boilerplate/31-management-database.md) | Management track (completed) |
| 32 | [32-management-api.md](../../completed/boilerplate/32-management-api.md) | Management track (completed) |
| 33 | [33-management-web.md](../../completed/boilerplate/33-management-web.md) | Management track (completed) |
| 34 | 34-signup-verification-and-password-flows.md | Phase 6b (completed) |
| 35 | 35-api-integration-test-setup.md | Phase 6c (completed) |
| 36 | 36-api-integration-auth-tests.md | Phase 6c (completed) |
| – | COPY-PASTA.md | Prompts |

## Dependency map

- **01** → 02 (infra before docker).
- **02** → 03, 04 (docker before postgres/valkey).
- **03** → 12 (postgres before orm).
- **04** → 22 (valkey before dashboard messages).
- **11** → 12 (helpers before orm).
- **12** → 15 (orm before auth).
- **15** → 14 (auth routes/controllers before Joi validation; validation then applies to real endpoints).
- **15** → 22 (auth before dashboard).
- **16–19** → 21, 20 (layout/themes/components before i18n and settings).
- **21** → 20 (i18n before settings page; settings uses locale selector and t()).
- **20** → 22 (settings and i18n before dashboard).
- **14, 15, 22** → 24 (OpenAPI docs describe auth and messages API; run 24 after those exist). Phase 6 runs 15 then 14.
- **24, 23, 11, 12, 21** → 25 (alignment phase assumes OpenAPI, docs, validation, ORM/init, i18n exist).
- **25** → 26 (git hooks depend on lint/format from 05 and GITFLOW from 09).
- **26** → 27 (project description; optional, after docs/structure exist).
- **27** → 28 (GitHub repo setup doc runs after project description; references 09, 10, 26).
- **10** → 29 (Dependabot uses labels dependencies, docker; 29 can run after 28 or in Phase 14).
- **29** → 30 (Jenkins local runs after all other phases).
- **Management (before Phase 7):** Plans 31, 32, 33 (management database, API, web) are complete.
  After Phase 6 run **31** → **32** (management DB, then API). Then **16–19** (shared UI
  package). Then **33** (management web; consumes shared UI). Then **21** → **20** → **22**
  (Phase 7b; main web frontend). 12 (main ORM) → 32 (management API needs main DB for user
  CRUD).
- **Phase 6c (API integration tests):** 34 → 35 (auth/verification endpoints exist before test
  setup); 35 → 36 (setup before auth test cases and CI test step).
- **Phase 2:** 05 runs before 08 (both modify root Makefile); 06, 07, 08 can run in parallel
  after 05.

## Decisions (recorded)

- **Default branch**: develop. PRs merge into develop; set repo default branch to develop so
  CI and GITFLOW docs are correct.
- **CI** (plan 09): Validate runs **only** when an authorized user (OWNER/MEMBER/COLLABORATOR)
  comments **/test** on a PR. No automatic run on PR open/update; no push-to-branch trigger.
- **ORM schema** (plan 12): Numbered migrations in `infra/database/migrations/` (e.g. 0000_init_helpers.sql,
  0001_users.sql); `init_database.sql` is generated by `scripts/database/combine-migrations.sh`. Plan 03
  creates read-only and read-write DB users (like Podverse).
- **Auth** (plan 15): JWT (Bearer or cookie); design auth middleware so revocable API keys
  can be added later (e.g. api_keys table, accept ApiKey header) without blocking. Two modes:
  **mailer** (self-service signup when mailer configured) and **no-mailer** (admin bootstrap at
  startup, admin creates users, first-login password change required). When Management API
  is present, main API does not expose admin user creation (plan 32 is canonical).
- **Bump script** (plan 07): Commit and push version bump automatically (--no-verify).
- **Management** (plans 31–33): Management API + Management Web; dedicated management DB
  (SQLite default, optional second Postgres); single super admin + scoped admins; audit
  events table and Events page. Management runs **before** Phase 7 (31 → 32 → shared UI
  16–19 → 33) so management DB, API, and Web are minimally functional before main web
  frontend work (Phase 7b). **Shared UI package** in monorepo for reusable React
  components and styles used by web and management-web.

## Current state

- **Phases 1–8, 10, 12, 13, 14 and Management (31, 32, 33) are complete.** Phase 7a (shared UI),
  Management Web (33), Phase 8 (OpenAPI/Swagger), Phase 10 (LLM alignment), Phase 12
  (project description), Phase 13 (GitHub repo setup docs), Phase 14 (Dependabot) are
  implemented.
- **Repo has:** packages (helpers, orm, ui), apps (api, web, management-api, management-web,
  web/sidecar), infra (database, docker, migrations), .github (CI with /test, dependabot),
  Makefile, auth (mailer + no-mailer), verification flows, Vitest + supertest,
  OpenAPI/Swagger at /api-docs, skills/rules/AGENTS.md, docs (GITFLOW, GITHUB-SETUP,
  DEPENDABOT, etc.).
- **Remaining active:** Phase 7b (22 dashboard/realtime messages), Phase 9 (23
  documentation/diagrams), Phase 11 (26 git hooks), Phase 15 (30 Jenkins local).
