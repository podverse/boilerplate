# Boilerplate – Summary

## Scope

- Align boilerplate monorepo with podverse structure as a **hello-world boilerplate**.
- **Features**: signup, login, post messages, real-time dashboard; messages in Valkey, auth in
  Postgres; privacy toggle (messages visible only to user unless “viewable by anyone”).
- **Out of scope**: deployment (no k8s); alpha publish is a stub (script + docs only).
- **Style**: Minimal; functionality and clarity.

## Plan files (27 topics + 2 meta)

| ID | File | Phase |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Meta |
| – | 00-SUMMARY.md | Meta |
| 01 | 01-infra-directory.md | 1 |
| 02 | 02-docker-files.md | 1 |
| 03 | 03-add-postgres.md | 1 |
| 04 | 04-add-valkey.md | 1 |
| 05 | 05-validate.md | 2 |
| 06 | 06-audit.md | 2 |
| 07 | 07-bump-version.md | 2 |
| 08 | 08-makefiles.md | 2 |
| 09 | 09-gitflow-test.md | 3 |
| 10 | 10-git-labels.md | 3 |
| 11 | 11-helpers-package.md | 4 |
| 12 | 12-orm-package.md | 4 |
| 13 | 13-alpha-publish-stub.md | 5 |
| 14 | 14-joi-validation.md | 6 |
| 15 | 15-auth-handling.md | 6 |
| 16 | 16-scss.md | 7 |
| 17 | 17-responsive-layout.md | 7 |
| 18 | 18-themes.md | 7 |
| 19 | 19-basic-components.md | 7 |
| 20 | 20-settings-page.md | 7 |
| 21 | 21-i18n-translations.md | 7 |
| 22 | 22-dashboard-realtime.md | 7 |
| 23 | 23-documentation-diagrams.md | 9 |
| 24 | 24-openapi-docs.md | 8 |
| 25 | 25-llm-alignment-skills-rules.md | 10 |
| 26 | 26-git-hooks.md | 11 |
| 27 | 27-project-description.md | 12 |
| – | COPY-PASTA.md | Prompts |

## Dependency map

- **01** → 02 (infra before docker).
- **02** → 03, 04 (docker before postgres/valkey).
- **03** → 12 (postgres before orm).
- **04** → 22 (valkey before dashboard messages).
- **11** → 12 (helpers before orm).
- **12** → 15 (orm before auth).
- **15** → 22 (auth before dashboard).
- **16–19** → 21, 20 (layout/themes/components before i18n and settings).
- **21** → 20 (i18n before settings page; settings uses locale selector and t()).
- **20** → 22 (settings and i18n before dashboard).
- **14, 15, 22** → 24 (OpenAPI docs describe auth and messages API; run 24 after those exist).
- **24, 23, 11, 12, 21** → 25 (alignment phase assumes OpenAPI, docs, validation, ORM/init, i18n exist).
- **25** → 26 (git hooks depend on lint/format from 05 and GITFLOW from 09).
- **26** → 27 (project description run last; optional, after docs/structure exist).
- **Phase 2:** 05 runs before 08 (both modify root Makefile); 06, 07, 08 can run in parallel
  after 05.

## Decisions (recorded)

- **Default branch**: develop. PRs merge into develop; set repo default branch to develop so
  CI and GITFLOW docs are correct.
- **CI** (plan 09): Validate runs when a PR is created/updated **targeting develop**, and
  when an authorized user comments **/test** on a PR. No push-to-branch trigger.
- **ORM schema** (plan 12): Option A – init script in `infra/database/combined/init_database.sql`;
  ORM only connects; no TypeORM migrations.
- **Auth** (plan 15): JWT (Bearer or cookie); design auth middleware so revocable API keys
  can be added later (e.g. api_keys table, accept ApiKey header) without blocking.
- **Bump script** (plan 07): Commit and push version bump automatically (--no-verify).

## Current state (pre-implementation)

- **Boilerplate**: apps/api, apps/web, apps/web/sidecar; start-feature.sh; env validation in
  apps/api. No packages/, infra/, .github/, Makefile.
- **Reference**: Podverse infra, scripts, Makefile, .github/workflows (CI with /test).
