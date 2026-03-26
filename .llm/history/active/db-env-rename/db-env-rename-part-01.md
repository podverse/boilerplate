# db-env-rename

## Started

- **Author:** Agent
- **Context:** Align DB env templates and consumers on `DB_*` / `DB_APP_*` / `DB_MANAGEMENT_*`; cluster user `user`; Compose/K8s bridge to official `POSTGRES_*`.

### Session 1 - 2026-03-24

#### Prompt (Developer)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Templates: `db.env.example` holds `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`; `db-app` / `db-management` hold `DB_APP_*` and `DB_MANAGEMENT_*` only; removed duplicate app-layer keys from management template.
- Docker Compose and k8s `workloads.yaml` map `POSTGRES_*` from `DB_*` / `DB_APP_NAME`; probes and pgAdmin use `user` / `DB_PASSWORD`.
- Init scripts and `local-management-db.sh` use new var names; `PG_SUPERUSER` prefers `DB_USER` then `POSTGRES_USER`.
- `setup.sh` generates `DB_PASSWORD` / `DB_APP_*` / `DB_MANAGEMENT_*` passwords with fallbacks for legacy `POSTGRES_*` keys; syncs `DB_APP_NAME`, `MANAGEMENT_DB_*`, usernames into app `.env` files from templates.
- `classification.yaml` postgres workload lists updated config/secrets; `literals_only_in_source` trimmed to `DB_HOST`, `DB_PORT`.
- `COMPOSE_LOCAL_ENV` includes `db.env` and `db-app.env`; `LOCAL_PG_USER` default `user`.

#### Files Created/Modified

- `infra/config/env-templates/db.env.example`
- `infra/config/env-templates/db-app.env.example`
- `infra/config/env-templates/db-management.env.example`
- `infra/docker/local/docker-compose.yml`
- `infra/docker/local/pgadmin/servers.json`
- `infra/k8s/base/stack/workloads.yaml`
- `infra/database/combined/01_create_users.sh`
- `infra/k8s/base/stack/postgres-init/01_create_users.sh`
- `infra/k8s/base/stack/postgres-init/02_init_management_db.sh`
- `scripts/local-env/local-management-db.sh`
- `scripts/local-env/setup.sh`
- `scripts/env-setup-secrets.sh`
- `infra/k8s/env/classification.yaml`
- `makefiles/local/Makefile.local.docker.mk`
- `makefiles/local/Makefile.local.env.mk`
- `AGENTS.md`
- `docs/development/K8S-ENV-RENDER.md`
- `docs/development/LOCAL-ENV-OVERRIDES.md`

### Session 2 - 2026-03-24

#### Prompt (Developer)

i think we should remove references to "DB_NAME" entirely from boilerplate, since in our contexts, we only ever want DB_APP_NAME or DB_MANAGEMENT_NAME

#### Key Decisions

- Main app database name is only `DB_APP_NAME` (ORM `data-source.ts`, api/management-api validation, `.env.example`, tests, Playwright, seeds, `setup.sh`, `env-setup-secrets.sh`, `classification.yaml` config keys).
- Left `MANAGEMENT_DB_NAME` unchanged (management ORM connection string); management DB logical name in infra templates remains `DB_MANAGEMENT_NAME` where applicable.

#### Files Created/Modified

- `packages/orm/src/data-source.ts`
- `packages/orm/PACKAGES-ORM.md`
- `apps/api/src/lib/startup/validation.ts`
- `apps/management-api/src/lib/startup/validation.ts`
- `apps/api/.env.example`
- `apps/management-api/.env.example`
- `apps/api/src/test/setup.ts`
- `apps/management-api/src/test/setup.ts`
- `apps/api/src/test/global-setup.mjs`
- `apps/management-api/src/test/global-setup.mjs`
- `apps/web/playwright.config.ts`
- `apps/web/playwright.signup-enabled.config.ts`
- `apps/web/playwright.admin-only-email.config.ts`
- `apps/management-web/playwright.config.ts`
- `scripts/local-env/setup.sh`
- `scripts/env-setup-secrets.sh`
- `infra/k8s/env/classification.yaml`
- `infra/config/env-templates/db-app.env.example`
- `tools/web/seed-e2e.mjs`
- `tools/management-web/seed-e2e.mjs`
- `tools/generate-data/TOOLS-GENERATE-DATA.md`
- `AGENTS.md`
- `.cursor/skills/api-testing/SKILL.md`
- `.github/workflows/ci.yml`

### Session 3 - 2026-03-24

#### Prompt (Developer)

@boilerplate/.github/workflows/ci.yml:48 this should be boilerplate_app_test for consistency

#### Key Decisions

- Main test database name is `boilerplate_app_test` (aligned with `boilerplate_app` + `_test`). Docker test containers stay `boilerplate_test_postgres` / `boilerplate_test_valkey`.

#### Files Created/Modified

- `.github/workflows/ci.yml`
- `makefiles/local/Makefile.local.test.mk`
- `apps/api/src/test/setup.ts`
- `apps/api/src/test/global-setup.mjs`
- `apps/management-api/src/test/setup.ts`
- `apps/management-api/src/test/global-setup.mjs`
- `apps/web/playwright.config.ts`
- `apps/web/playwright.signup-enabled.config.ts`
- `apps/web/playwright.admin-only-email.config.ts`
- `apps/management-web/playwright.config.ts`
- `tools/web/seed-e2e.mjs`
- `scripts/check-test-requirements.mjs`
- `docs/testing/E2E-PAGE-TESTING.md`
- `docs/testing/TEST-SETUP.md`
- `AGENTS.md`
- `.cursor/skills/api-testing/SKILL.md`
