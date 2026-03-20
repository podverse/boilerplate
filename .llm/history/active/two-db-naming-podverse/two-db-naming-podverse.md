# Feature: two-db-naming-podverse

## Metadata
- Started: 2026-03-20
- Context: Align Boilerplate two-database naming with Podverse (boilerplate_app, boilerplate_management; POSTGRES_DB / POSTGRES_MANAGEMENT_DB).

## Sessions

### Session 1 - 2026-03-20

#### Prompt (Developer)

Align Boilerplate two-database naming with Podverse. Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- App DB name: `boilerplate_app`; management DB: `boilerplate_management` (aligned with Podverse podverse_app / podverse_management).
- db.env.example is single source of truth: POSTGRES_DB, POSTGRES_MANAGEMENT_DB, DB_NAME, MANAGEMENT_DB_NAME.
- Init script 02_init_management_db.sh prefers POSTGRES_MANAGEMENT_DB then MANAGEMENT_DB_NAME then default.
- Test DB names (boilerplate_test, boilerplate_management_test) left unchanged.

#### Files Created/Modified

- infra/config/env-templates/db.env.example
- apps/api/.env.example
- apps/management-api/.env.example
- infra/k8s/base/stack/postgres-init/02_init_management_db.sh
- AGENTS.md
- .llm/history/active/two-db-naming-podverse/two-db-naming-podverse.md

### Session 2 - 2026-03-20

#### Prompt (Developer)

Align Boilerplate DB user names with Podverse. Implement the plan as specified.

#### Key Decisions

- Per-DB role names: app `boilerplate_app_read` / `boilerplate_app_read_write`, management `boilerplate_management_read` / `boilerplate_management_read_write`.
- Added POSTGRES_READ_USER, POSTGRES_READ_WRITE_USER, POSTGRES_MANAGEMENT_READ_USER, POSTGRES_MANAGEMENT_READ_WRITE_USER and _PASSWORD vars to db.env.example; kept app-facing DB_READ_USERNAME etc. with new values.
- Init scripts 01 and 02 create and grant using env vars; 02 creates management users before granting.
- CI and Makefile test targets create all four roles and grant per DB; test setup defaults and env updated.
- setup.sh generates POSTGRES_MANAGEMENT_READ_PASSWORD and POSTGRES_MANAGEMENT_READ_WRITE_PASSWORD; MANAGEMENT_DB_PASSWORD sourced from management read-write password.

#### Files Created/Modified

- infra/config/env-templates/db.env.example
- apps/api/.env.example, apps/management-api/.env.example
- infra/k8s/base/stack/postgres-init/01_create_users.sh, infra/database/combined/01_create_users.sh
- infra/k8s/base/stack/postgres-init/02_init_management_db.sh
- .github/workflows/ci.yml
- makefiles/local/Makefile.local.test.mk
- apps/api/src/test/setup.ts, apps/management-api/src/test/setup.ts
- scripts/local-env/setup.sh
- AGENTS.md
- .llm/history/active/two-db-naming-podverse/two-db-naming-podverse.md
