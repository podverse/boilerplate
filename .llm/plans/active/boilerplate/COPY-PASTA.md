# Boilerplate – Copy-Pasta Prompts for Parallel Execution

## Execution rules

- **Phases are sequential.** Finish a phase completely before starting the next. Do not run
  Phase 2 while Phase 1 is still running.
- **Within a phase,** some steps are sequential and some are parallel. Always wait for a step
  (or parallel group) to finish before starting the next step in that phase. Only start
  "in parallel" steps after all prior steps in the same phase have completed.
- When you paste a prompt below into an agent, execute it immediately; the paste is the
  instruction to run.

## How to use

Each line below means: do the step(s), **wait for completion**, then do the next.

1. **Phase 1:** Run 01 (one agent). **Wait for 01 to finish.** Run 02 (one agent). **Wait for
   02 to finish.** Then run 03 and 04 in parallel (two agents—paste 1C and 1D). **Wait for
   both 03 and 04 to finish.** Only then start Phase 2.
2. **Phase 2:** Run 05 (one agent). **Wait for 05 to finish.** Then run 06, 07, 08 in
   parallel (three agents). Do not run 05 and 08 in parallel (both touch the same
   Makefile). **Wait for 06, 07, 08 to finish** before Phase 3.
3. **Phase 3:** Run 09 and 10 in parallel (two agents). **Wait for both to finish** before
   Phase 4. (completed)
4. **Phase 4:** Run 11 (one agent). **Wait for 11 to finish.** Run 12 (one agent). **Wait for
   12 to finish** before Phase 5.
5. **Phase 5:** Run 13 (one agent). (completed) **Skip; proceed to Phase 6.**
6. **Phase 6, 6b, 6c:** (completed) Plans 14, 15, 34, 35, 36 are in `.llm/plans/completed/boilerplate/`. Do not re-execute. **Skip to step 7.**
7. **Management (before Phase 7):** (completed) Plans 31 and 32 are in `.llm/plans/completed/boilerplate/`.
   Do not re-execute 31 or 32. Management DB and API are in place.
8. **Phase 7a – Shared UI:** Run 16, 17, 18, 19 in parallel (four agents). **Wait for all
   four to finish.** (Shared UI package for web and management-web.)
9. **Management Web:** Run 33 (one agent). **Wait for 33.** (Management minimally functional.)
10. **Phase 7b – Main web frontend:** Run 21 (one agent). **Wait for 21.** Run 20 (one
    agent). **Wait for 20.** Run 22 (one agent). **Wait for 22** before Phase 8.
11. **Phase 8:** Run 24 (one agent). **Wait for 24 to finish** before Phase 9.
12. **Phase 9:** Run 23 (one agent). **Wait for 23 to finish** before Phase 10.
13. **Phase 10:** Run 25 (one agent). **Wait for 25 to finish** before Phase 11.
14. **Phase 11:** Run 26 (one agent). **Wait for 26 to finish** before Phase 12.
15. **Phase 12:** Run 27 (one agent). **Wait for 27 to finish** before Phase 13.
16. **Phase 13:** Run 28 (one agent). **Wait for 28 to finish** before Phase 14.
17. **Phase 14:** Run 29 (one agent). **Wait for 29 to finish** before Phase 15.
18. **Phase 15:** Run 30 (one agent). **Wait for 30 to finish.** Done.

Management is run in steps 7–9 before Phase 7b (main web frontend).

---

## Phase 1 (sequential)

### Agent 1A: Infra directory

Read and execute `.llm/plans/active/boilerplate/01-infra-directory.md`. Create the
infra directory layout, env templates, and update .gitignore. Verify directories and
templates exist.

### Agent 1B: Docker files (after 1A done)

Read and execute `.llm/plans/active/boilerplate/02-docker-files.md`. Add
Dockerfiles and docker-compose for api, web, and sidecar; shared network. Verify build and
up.

### Agent 1C: Postgres (after 1B done)

Read and execute `.llm/plans/active/boilerplate/03-add-postgres.md`. Add Postgres
service and init script. Verify Postgres starts and init runs.

### Agent 1D: Valkey (after 1B done)

Read and execute `.llm/plans/active/boilerplate/04-add-valkey.md`. Add Valkey
service and env docs. Verify Valkey starts and port is reachable.

---

## Phase 2 (sequential then parallel)

**Step 1:** Run 05 first (one agent). **Step 2:** Run 06, 07, 08 in parallel (three agents).
Do not run 05 and 08 in parallel; both modify the root Makefile.

### Agent 2A: Validate (run first)

Read and execute `.llm/plans/active/boilerplate/05-validate.md`. Add Make
validate and optional validate_docker. Verify `make validate` runs and passes.

### Agent 2B: Audit (after 2A; can run with 2C, 2D)

Read and execute `.llm/plans/active/boilerplate/06-audit.md`. Add
scripts/audit/audit.sh. Verify script exits 0 when no vulns, 1 when vulns.

### Agent 2C: Bump version (after 2A; can run with 2B, 2D)

Read and execute `.llm/plans/active/boilerplate/07-bump-version.md`. Add
scripts/publish/bump-version.sh. Verify version bump updates root and workspaces.

### Agent 2D: Makefiles (after 2A; can run with 2B, 2C)

Read and execute `.llm/plans/active/boilerplate/08-makefiles.md`. Extend the
Makefile created by plan 05: add audit and local docker targets (network, postgres,
valkey, api, web). Verify make targets run.

---

## Phase 3 (parallel – 2 agents) — complete

### Agent 3A: Gitflow and /test

Read and execute `.llm/plans/completed/boilerplate/09-gitflow-test.md`. Add
.github/workflows/ci.yml and document gitflow. Verify push and /test trigger CI.

### Agent 3B: Git labels

Read and execute `.llm/plans/completed/boilerplate/10-git-labels.md`. Add
scripts/github/setup-all-labels.sh and optional pr-labeler. Verify labels exist after run.

---

## Phase 4 (sequential) — complete

Phase 4 plans have been moved to `.llm/plans/completed/boilerplate/`. Do not re-execute.

### Agent 4A: Helpers package (completed)

Implemented per `.llm/plans/completed/boilerplate/11-helpers-package.md`. packages/helpers
with env validation; API and web-sidecar use it for startup env validation.

### Agent 4B: ORM package (completed)

Implemented per `.llm/plans/completed/boilerplate/12-orm-package.md`. packages/orm with
User entity and DataSource using read-write DB credentials (DB_READ_WRITE_*); API startup
validation requires DB_READ_* and DB_READ_WRITE_*. Schema: numbered migrations in
infra/database/migrations/; init_database.sql generated by
scripts/database/combine-migrations.sh (do not edit by hand).

---

## Phase 5 (completed)

### Agent 5: Alpha publish

Phase 5 is complete. Plan 13 is in `.llm/plans/completed/boilerplate/13-alpha-publish-stub.md`.
Workflow: `.github/workflows/publish-alpha.yml`. Docs: `docs/PUBLISH.md`. Do not re-run.

---

## Phase 6, 6b, 6c (completed)

Phase 6, 6b, and 6c are complete. Plans 14, 15, 34, 35, and 36 are in `.llm/plans/completed/boilerplate/`. Do not re-execute.

- **15-auth-handling** – Auth routes, login, signup, logout, change-password, me; mailer and no-mailer modes; admin bootstrap.
- **14-joi-validation** – Joi schemas and validateBody middleware for auth (and verification) routes.
- **34-signup-verification-and-password-flows** – Verify-email, forgot-password, reset-password, request/confirm-email-change; VerificationToken, mailer integration.
- **35-api-integration-test-setup** – Vitest, supertest, createApp(), global-setup, test DB docs, AGENTS.md Testing section.
- **36-api-integration-auth-tests** – auth.test.ts, auth-no-mailer.test.ts, auth-mailer.test.ts; CI test step with Postgres + Valkey and init.

---

## Management (before Phase 7)

Run right after Phase 6. Plans 31 and 32 are complete. Do not re-execute.

### Agent 31: Management database (completed)

Implemented per `.llm/plans/completed/boilerplate/31-management-database.md`. Dedicated
management store (second Postgres): super admin, admins, permissions (including
event_visibility), and management_events (audit log). Do not re-run.

### Agent 32: Management API (completed)

Implemented per `.llm/plans/completed/boilerplate/32-management-api.md`. `apps/management-api`:
auth (super admin + admins), JWT, permission checks, record events on every action, GET
/events with visibility rules. Main-user CRUD via main DB. Do not re-run.

---

## Phase 7a: Shared UI package

Run 16, 17, 18, 19 in parallel (four agents). Delivers `packages/ui` / `@boilerplate/ui`.

### Agent 7A: SCSS

Read and execute `.llm/plans/active/boilerplate/16-scss.md`. Enable SCSS and
variables; styles last. Verify build and one SCSS usage.

### Agent 7B: Responsive layout

Read and execute `.llm/plans/active/boilerplate/17-responsive-layout.md`. Add
layout and breakpoints. Verify resize behavior.

### Agent 7C: Themes

Read and execute `.llm/plans/active/boilerplate/18-themes.md`. Add theme context
and CSS variables. Verify toggle updates UI.

### Agent 7D: Basic components

Read and execute `.llm/plans/active/boilerplate/19-basic-components.md`. Add
Button, Input, Card. Verify usage on a page.

---

## Management Web (after Phase 7a)

### Agent 33: Management Web

Read and execute `.llm/plans/active/boilerplate/33-management-web.md`. Add
`apps/management-web`: login to management API, permission-based UI, Events page. Consume
shared UI package (`@boilerplate/ui`) for components and styles. Verify Events page and
shared package usage.

---

## Phase 7b: Main web frontend

Requires web app to exist (`apps/web` already exists). Run 21, then 20, then 22.

### Agent 7E: i18n (run first in Phase 7b)

Read and execute `.llm/plans/active/boilerplate/21-i18n-translations.md`. Add
i18n and translation keys. Verify locale switch. Run this before the settings page (20).

### Agent 7F: Settings page (run after 7E)

Read and execute `.llm/plans/active/boilerplate/20-settings-page.md`. Add
settings with locale and theme; uses i18n from plan 21. Verify persistence.

### Agent 7G: Dashboard realtime (after auth + API messages)

Read and execute `.llm/plans/active/boilerplate/22-dashboard-realtime.md`.
Implement dashboard, message form, list, Valkey storage, privacy toggle. Verify
end-to-end.

---

## Phase 8: OpenAPI docs and test UI

### Agent 8A: OpenAPI + Swagger UI (after 15 and 22)

Read and execute `.llm/plans/active/boilerplate/24-openapi-docs.md`. Add
OpenAPI 3.x spec for all API routes and serve Swagger UI at /api-docs for interactive
testing. Verify spec loads and “Try it out” works with JWT.

---

## Phase 9: Documentation and diagrams

### Agent 9: Documentation and diagrams

Read and execute `.llm/plans/active/boilerplate/23-documentation-diagrams.md`.
Add docs and architecture diagrams. Verify links and diagrams.

---

## Phase 10: LLM alignment

### Agent 10: Skills, rules, and AGENTS.md alignment

Read and execute `.llm/plans/active/boilerplate/25-llm-alignment-skills-rules.md`.
Add or update skills and cursor rules so that when API, env, DB, i18n, or docs change, LLMs
are reminded to update OpenAPI, validation, init script, translations, and README/docs. Add
the “LLM alignment” section to AGENTS.md. Verify alignment checklist is clear and
actionable.

---

## Phase 11: Git hooks (final)

### Agent 11: Git hooks (Podverse-aligned)

Read and execute `.llm/plans/active/boilerplate/26-git-hooks.md`. Set up
scripts/git-hooks/ with install-hooks.sh, pre-commit (lint-staged), commit-msg (issue ref),
pre-push (block direct push to develop; branch naming). Add root package.json "prepare" and
lint-staged config; add scripts/git-hooks/ to .dockerignore. Document in README or
GITFLOW.md. Verify hooks install on npm install and block/behave as specified.

---

## Phase 12: Project description

### Agent 12: Project description – Boilerplate-specific and implementation details

Read and execute `.llm/plans/active/boilerplate/27-project-description.md`. Update the
project description so it is clearly Boilerplate-specific: set root package.json
description and add (or expand) a README section that describes what Boilerplate is and
lists implementation details (stack, features, repo structure). Verify description and
README align with the implemented plans.

---

## Phase 13: GitHub repo setup (documentation)

### Agent 13: GitHub repo setup – labels, branch protection, optional GitHub App

Read and execute `.llm/plans/active/boilerplate/28-github-repo-setup.md`. Add
documentation for one-time GitHub configuration: how to run the labels script (plan 10),
how to configure branch protection and default branch for develop (plans 09, 26), and
optional GitHub App. Create or extend `docs/GITHUB-SETUP.md` and link from README or docs
index. Verify the doc references plans 09, 10, and 26 where relevant.

---

## Phase 14: Dependabot

### Agent 14: Dependabot – dependabot.yml and DEPENDABOT.md

Read and execute `.llm/plans/active/boilerplate/29-dependabot.md`. Add
`.github/dependabot.yml` (npm at root with groups, Docker for infra/docker/local api/web/web-sidecar, github-actions; target develop; Node LTS for Docker) and `docs/repo-management/DEPENDABOT.md`. Verify config and doc align with Podverse pattern (schedule, groups, labels).

---

## Phase 15: Jenkins local

### Agent 15: Jenkins local – deployment-only, folder "local", programmatic setup

Read and execute `.llm/plans/active/boilerplate/30-jenkins-local.md`. Add local Jenkins
(Docker Compose or Make target), pre-populated user, folder named `local`, and
deployment-only pipeline jobs (Jenkinsfiles + setup/import.sh + scm-job.xml with sparse
checkout). Document in `docs/pipelines/JENKINS-LOCAL.md`. Jenkins is deployment-only; no
publish jobs. Verify Jenkins starts, user can log in, folder `local` has jobs, and jobs
use isolated workspace (no collision with host repo).

