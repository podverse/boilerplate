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
   Phase 4.
4. **Phase 4:** Run 11 (one agent). **Wait for 11 to finish.** Run 12 (one agent). **Wait for
   12 to finish** before Phase 5.
5. **Phase 5:** Run 13 (one agent). **Wait for 13 to finish** before Phase 6.
6. **Phase 6:** Run 14 and 15 in parallel, or run 14 then 15 (15 depends on orm from 12).
   **Wait for both to finish** before Phase 7.
7. **Phase 7:** Run 16, 17, 18, 19 in parallel (four agents). **Wait for all four to
   finish.** Run 21 (one agent). **Wait for 21.** Run 20 (one agent). **Wait for 20.** Run 22
   (one agent). **Wait for 22** before Phase 8.
8. **Phase 8:** Run 24 (one agent). **Wait for 24 to finish** before Phase 9.
9. **Phase 9:** Run 23 (one agent). **Wait for 23 to finish** before Phase 10.
10. **Phase 10:** Run 25 (one agent). **Wait for 25 to finish** before Phase 11.
11. **Phase 11:** Run 26 (one agent). **Wait for 26 to finish.** Done.

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

## Phase 3 (parallel – 2 agents)

### Agent 3A: Gitflow and /test

Read and execute `.llm/plans/active/boilerplate/09-gitflow-test.md`. Add
.github/workflows/ci.yml and document gitflow. Verify push and /test trigger CI.

### Agent 3B: Git labels

Read and execute `.llm/plans/active/boilerplate/10-git-labels.md`. Add
scripts/github/setup-all-labels.sh and optional pr-labeler. Verify labels exist after run.

---

## Phase 4 (sequential)

### Agent 4A: Helpers package

Read and execute `.llm/plans/active/boilerplate/11-helpers-package.md`. Add
packages/helpers with env validation; API uses it. Verify build and startup validation.

### Agent 4B: ORM package (after 4A)

Read and execute `.llm/plans/active/boilerplate/12-orm-package.md`. Add
packages/orm with User entity and DataSource. Verify build and DB connection.

---

## Phase 5

### Agent 5: Alpha publish stub

Read and execute `.llm/plans/active/boilerplate/13-alpha-publish-stub.md`. Add
script stub and short doc. Verify script runs and docs describe real flow.

---

## Phase 6 (parallel or sequential)

### Agent 6A: Joi validation

Read and execute `.llm/plans/active/boilerplate/14-joi-validation.md`. Add Joi
schemas and validation for auth and message routes. Verify 400 on invalid bodies.

### Agent 6B: Auth handling (after ORM)

Read and execute `.llm/plans/active/boilerplate/15-auth-handling.md`. Implement
signup, login, logout, protected routes. Verify full auth flow.

---

## Phase 7 (parallel groups)

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

### Agent 7E: i18n (run after 7A–7D)

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
