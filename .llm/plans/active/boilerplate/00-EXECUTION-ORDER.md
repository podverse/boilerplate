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
| [14-joi-validation.md](../../completed/boilerplate/14-joi-validation.md) (completed) | Joi validation |
| [15-auth-handling.md](../../completed/boilerplate/15-auth-handling.md) (completed) | Auth handling |
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
| [31-management-database.md](../../completed/boilerplate/31-management-database.md) (completed) | Management DB (identities, permissions, audit events) (completed) |
| [32-management-api.md](32-management-api.md) | Management API (auth, admin CRUD, events API) |
| [33-management-web.md](33-management-web.md) | Management Web (UI, Events page; uses shared UI package) |
| [34-signup-verification-and-password-flows.md](../../completed/boilerplate/34-signup-verification-and-password-flows.md) (completed) | Sign-up verification and password flows (email verify, forgot/reset password, change email) |
| [35-api-integration-test-setup.md](../../completed/boilerplate/35-api-integration-test-setup.md) (completed) | API integration test setup (Vitest, supertest, app factory, test DB, mailer mock) |
| [36-api-integration-auth-tests.md](../../completed/boilerplate/36-api-integration-auth-tests.md) (completed) | API integration auth tests (login, signup, verification flows; CI test step) |
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

## Phase 6: API (sequential: auth then validation) — complete

Implemented. Plan files are in `.llm/plans/completed/boilerplate/`. Do not re-execute.

- **15-auth-handling** – Run first (after 12). (completed)
- **14-joi-validation** – Run after 15. (completed)

## Phase 6b: Auth verification flows (mailer mode) — complete

Implemented. Plan file is in `.llm/plans/completed/boilerplate/`. Do not re-execute.

- **34-signup-verification-and-password-flows** – Run after 15 (auth handling). (completed)

## Phase 6c: API integration tests (sequential) — complete

Implemented. Plan files are in `.llm/plans/completed/boilerplate/`. Do not re-execute.

- **35-api-integration-test-setup** – Run after 34. (completed)
- **36-api-integration-auth-tests** – Run after 35. (completed)

## Management (before Phase 7)

Run after Phase 6 so that management DB, API, and (after Phase 7a and 33) Web are minimally functional before Phase 7b.

- **31-management-database** (completed) – Run after Phase 6. Dedicated store (SQLite default) for
  management identities, permissions, and audit events. Plan 31 is implemented; plan file is in
  `.llm/plans/completed/boilerplate/`.
- **32-management-api** – Run after 31. Express app; auth, events API, main-user CRUD via
  main DB.

## Phase 7a: Shared UI package

- **16-scss**, **17-responsive-layout**, **18-themes**, **19-basic-components** – Run in
  parallel after 32. Deliver into `packages/ui` / `@boilerplate/ui` so that both
  `apps/web` and `apps/management-web` depend on it for components and styles.

## Management Web (after Phase 7a)

- **33-management-web** – Run after Phase 7a. Next.js app; login to management API,
  permission-based UI, Events page; consumes shared UI. Management is now minimally
  functional (DB + API + Web).

## Phase 7b: Main web frontend

Requires web app to exist (`apps/web` already exists). Adds i18n, settings, and dashboard.

- **21-i18n-translations** – Run after 33. Three-tier layout (originals/overrides/compiled);
  translations for other locales via an LLM of your choosing (e.g. Cursor chat) or manually.
- **20-settings-page** – Run after 21 (uses locale selector and t() from i18n).
- **22-dashboard-realtime** – After 20; auth, API messages, Valkey, and privacy flag.

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

## Rules

- **Phases are sequential** – Finish a phase before starting the next (except where noted).
- **Management** runs sequentially after Phase 6 and before Phase 7b; Phase 7a (shared UI)
  runs between 32 and 33.
- **Within a phase** – Run only the plans marked as parallel simultaneously.
- **COPY-PASTA.md** – Use for multi-agent parallel execution; follow its execution rules.
