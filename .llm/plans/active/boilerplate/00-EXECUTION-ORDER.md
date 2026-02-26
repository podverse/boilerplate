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
| [09-gitflow-test.md](09-gitflow-test.md) | Gitflow and /test CI |
| [10-git-labels.md](10-git-labels.md) | Git labels and generation |
| [11-helpers-package.md](11-helpers-package.md) | Move validate env to helpers package |
| [12-orm-package.md](12-orm-package.md) | ORM package |
| [13-alpha-publish-stub.md](13-alpha-publish-stub.md) | Alpha publish stub |
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

## Phase 3: Gitflow and CI (parallel)

After Phase 2:

- **09-gitflow-test**, **10-git-labels** – Run in parallel.

## Phase 4: Packages (sequential)

- **11-helpers-package** – Run first.
- **12-orm-package** – After 11.

## Phase 5: Alpha stub

- **13-alpha-publish-stub** – Can run in parallel with Phase 4 or after.

## Phase 6: API (parallel where possible)

- **14-joi-validation**, **15-auth-handling** – 15 depends on orm; can start 14 anytime. Run 15 after 12.

## Phase 7: Frontend (parallel groups)

- **16-scss**, **17-responsive-layout**, **18-themes**, **19-basic-components** – Parallel.
- **21-i18n-translations** – Run after 18–19 (settings page depends on i18n).
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

## Phase 12: Project description (final)

- **27-project-description** – Run last. Update the project description to be clearly
  Boilerplate-specific: root `package.json` description and a README section that
  describes what Boilerplate is and lists implementation details (stack, features, repo
  structure). No technical dependency; run after 26 when docs and structure are in place.

## Rules

- **Phases are sequential** – Finish a phase before starting the next (except where noted).
- **Within a phase** – Run only the plans marked as parallel simultaneously.
- **COPY-PASTA.md** – Use for multi-agent parallel execution; follow its execution rules.
