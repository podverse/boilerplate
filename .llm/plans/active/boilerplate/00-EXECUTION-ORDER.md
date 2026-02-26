# Boilerplate – Execution Order

Master orchestration: run phases sequentially; within each phase, run the listed plan files in order or in parallel as noted.

## Plan file location

All plans: `.llm/plans/active/boilerplate/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, file inventory, dependency map |
| [01-infra-directory.md](../../completed/boilerplate/01-infra-directory.md) (completed) | Infra directory layout |
| [02-docker-files.md](../../completed/boilerplate/02-docker-files.md) (completed) | Dockerfiles and docker-compose (no k8s) |
| [03-add-postgres.md](../../completed/boilerplate/03-add-postgres.md) (completed) | Postgres service and init scripts |
| [04-add-valkey.md](../../completed/boilerplate/04-add-valkey.md) (completed) | Valkey service and config |
| [05-validate.md](../../completed/boilerplate/05-validate.md) (completed) | Make validate target |
| [06-audit.md](../../completed/boilerplate/06-audit.md) (completed) | Audit script |
| [07-bump-version.md](../../completed/boilerplate/07-bump-version.md) (completed) | Bump version script |
| [08-makefiles.md](../../completed/boilerplate/08-makefiles.md) (completed) | Root Makefile and local infra targets |
| [09-gitflow-test.md](../../completed/boilerplate/09-gitflow-test.md) (completed) | Gitflow and /test CI |
| [10-git-labels.md](../../completed/boilerplate/10-git-labels.md) (completed) | Git labels and generation |
| [11-helpers-package.md](../../completed/boilerplate/11-helpers-package.md) (completed) | Move validate env to helpers package |
| [12-orm-package.md](../../completed/boilerplate/12-orm-package.md) (completed) | ORM package |
| [13-alpha-publish-stub.md](../../completed/boilerplate/13-alpha-publish-stub.md) (completed) | Alpha publish (images on merge to alpha) |
| [14-joi-validation.md](14-joi-validation.md) | Joi validation |
| [15-auth-handling.md](15-auth-handling.md) | Auth handling |
| [16-scss.md](16-scss.md) | SCSS setup |
| [17-responsive-layout.md](17-responsive-layout.md) | Responsive layout |
| [18-themes.md](18-themes.md) | Dark/light themes |
| [19-basic-components.md](19-basic-components.md) | Basic components |
| [20-settings-page.md](20-settings-page.md) | Settings page (i18n + theme) |
| [21-i18n-translations.md](21-i18n-translations.md) | i18n translations |
| [22-dashboard-realtime.md](22-dashboard-realtime.md) | Dashboard and real-time messages |
| [23-documentation-diagrams.md](23-documentation-diagrams.md) | Documentation and diagrams |
| [24-openapi-docs.md](24-openapi-docs.md) | OpenAPI spec and Swagger UI (API docs + test page) |
| [25-llm-alignment-skills-rules.md](25-llm-alignment-skills-rules.md) | Skills, rules, AGENTS.md for LLM alignment (keep API↔OpenAPI, env↔validation, etc. in sync) |
| [26-git-hooks.md](26-git-hooks.md) | Git hooks (Podverse-aligned): pre-commit, commit-msg, pre-push; install via prepare |
| [27-project-description.md](27-project-description.md) | Project description: Boilerplate-specific wording and implementation details (package.json + README) |
| [28-github-repo-setup.md](28-github-repo-setup.md) | Documentation: GitHub labels, branch protection, optional GitHub App (as required from plans 09, 10, 26) |
| [29-dependabot.md](29-dependabot.md) | Dependabot: .github/dependabot.yml and docs/repo-management/DEPENDABOT.md |
| [30-jenkins-local.md](30-jenkins-local.md) | Jenkins local: run locally, folder "local", programmatic setup, deployment-only, sparse checkout |
| [31-management-database.md](31-management-database.md) | Management DB (identities, permissions, audit events) |
| [32-management-api.md](32-management-api.md) | Management API (auth, admin CRUD, events API) |
| [33-management-web.md](33-management-web.md) | Management Web (UI, Events page; uses shared UI package) |
| [COPY-PASTA.md](COPY-PASTA.md) | Copy-paste prompts for parallel agents |

## Phase 1: Infra and local run (sequential) — complete

1. **01-infra-directory** – Run first. (completed)
2. **02-docker-files** – After 01. (completed)
3. **03-add-postgres** and **04-add-valkey** – After 02; can run in parallel. (completed)

## Phase 2: Scripts and makefiles (sequential then parallel) — complete

After Phase 1 complete:

- **05-validate** – Run first (creates root Makefile with validate / validate_docker). (completed)
- **06-audit**, **07-bump-version**, **08-makefiles** – Run in parallel after 05. Plan 08
  extends the same Makefile created by 05; do not run 05 and 08 in parallel. (completed)

## Phase 3: Gitflow and CI (parallel) — complete

After Phase 2:

- **09-gitflow-test**, **10-git-labels** – Run in parallel. (completed)

## Phase 4: Packages (sequential) — complete

- **11-helpers-package** – Run first. (completed)
- **12-orm-package** – After 11. (completed)

## Phase 5: Alpha publish (images on merge to alpha) — complete

- **13-alpha-publish-stub** – Can run in parallel with Phase 4 or after. Workflow publishes
  Docker images to registry when merging to `alpha`. (completed)

## Phase 6: API (sequential: auth then validation)

- **15-auth-handling** – Run first (after 12). Implement auth routes and controllers so endpoints exist.
- **14-joi-validation** – Run after 15. Add Joi schemas and validation to auth (and message) routes; having real endpoints with varied params/body makes validation work concrete.

## Phase 7: Frontend (parallel groups)

- **Shared UI package:** Plans 16–19 deliver into a shared package (e.g. `packages/ui` /
  `@boilerplate/ui`) so that both `apps/web` and `apps/management-web` depend on it for
  components and styles. Build the shared package before apps that consume it.
- **16-scss**, **17-responsive-layout**, **18-themes**, **19-basic-components** – Parallel
  (implement in or for the shared UI package; apps import from it).
- **21-i18n-translations** – Run after 18–19 (settings page depends on i18n). Includes
  three-tier layout (originals/overrides/compiled) and workflow on push to develop to
  update translations; skips LLM translate when OPENAI_API_KEY is not set.
- **20-settings-page** – Run after 21 (uses locale selector and t() from i18n).
- **22-dashboard-realtime** – After auth, API messages, Valkey, and privacy flag.

## Phase 8: API documentation (OpenAPI + test UI)

- **24-openapi-docs** – Run after Phase 6 and plan 22 (auth and messages API exist). Add
  OpenAPI 3.x spec and Swagger UI at e.g. /api-docs for interactive testing. Can run in
  parallel with Phase 7 or Phase 9.

## Phase 9: Documentation and diagrams

- **23-documentation-diagrams** – Can start in parallel with Phase 7; update as features
  land.

## Phase 10: LLM alignment

- **25-llm-alignment-skills-rules** – After the repo has OpenAPI (24), validation
  (11), ORM and init script (12), i18n (21), and docs (23). Add and update skills, cursor
  rules, and an “LLM alignment” section in AGENTS.md so that when API endpoints, env vars,
  DB schema, i18n, or docs change, LLMs are reminded to update the corresponding artifacts
  (OpenAPI spec, validation, init script, translation files, README/docs).

## Phase 11: Git hooks

- **26-git-hooks** – Set up git hooks aligned with Podverse: `scripts/git-hooks/`
  with install-hooks.sh, pre-commit (lint-staged), commit-msg (issue ref), pre-push (block
  direct push to develop; branch naming). Root `package.json` "prepare" runs install;
  .dockerignore excludes scripts/git-hooks/. Depends on lint/format (05) and GITFLOW docs
  (09).

## Phase 12: Project description

- **27-project-description** – Update the project description to be clearly
  Boilerplate-specific: root `package.json` description and a README section that
  describes what Boilerplate is and lists implementation details (stack, features, repo
  structure). No technical dependency; run after 26 when docs and structure are in place.

## Phase 13: GitHub repo setup (documentation)

- **28-github-repo-setup** – Run after 27. Add documentation for one-time GitHub
  configuration: how to run the labels script (plan 10), how to configure branch
  protection and default branch for develop (plans 09, 26), and optional GitHub App setup.
  Creates or extends `docs/GITHUB-SETUP.md` and links from README or docs index.

## Phase 14: Dependabot

- **29-dependabot** – Run after 10 (labels exist). Add `.github/dependabot.yml` (npm at root
  with groups, Docker for infra/docker/local/api, web, web-sidecar, github-actions) and
  `docs/repo-management/DEPENDABOT.md`. Node LTS policy for Docker (even versions only).

## Phase 15: Jenkins local (after all other phases)

- **30-jenkins-local** – Run after Phase 14. Jenkins in Docker; pre-populated user; folder
  `local` with deployment-only pipeline jobs (Jenkinsfiles + import script); sparse checkout
  in isolated workspace (no collision with host repo). Docs: `docs/pipelines/JENKINS-LOCAL.md`.

## Management track (parallel to main phases)

Management work can run in parallel with Phases 7–9. No blocking dependency on main line
except: plan 32 needs main DB schema (plan 12) for user CRUD; plan 33 needs shared UI (19).

- **31-management-database** – Can run after Phase 6 (or in parallel with Phase 7).
  Dedicated store for management identities, permissions, and audit events (SQLite default).
- **32-management-api** – After 31. Express app; super admin + scoped admins; record events;
  GET /events with visibility rules.
- **33-management-web** – After 32 and after shared UI package exists (plan 19). Next.js app;
  login, permission-based UI, Events page; consumes `@boilerplate/ui`.

## Rules

- **Phases are sequential** – Finish a phase before starting the next (except where noted).
- **Within a phase** – Run only the plans marked as parallel simultaneously.
- **COPY-PASTA.md** – Use for multi-agent parallel execution; follow its execution rules.
