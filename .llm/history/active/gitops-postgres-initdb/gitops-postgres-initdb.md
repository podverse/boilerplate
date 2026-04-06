# gitops-postgres-initdb

## Session 1 - 2026-04-06

#### Prompt (Developer)

Boilerplate GitOps Postgres: `docker-entrypoint-initdb.d` (Podverse-style)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Split management grants into **`zz_management_grants.sh`** after **`z_load_management_schema.sql`**; removed broken **`psql -f init_management_database.sql`** from **`setup_management_database.sh`**.
- **`base/db`** uses ConfigMap **`boilerplate-db-postgres-init`**; duplicate **`postgres-init`** files under **`base/db/postgres-init/`** because Kustomize load restrictor disallows **`../stack/`** paths; **`combine-migrations.sh`** and **`make sync_k8s_postgres_init`** sync stack → db copies.
- **`combine-migrations` / sync** now write **`z_load_*.sql`** (not **`init_*.sql`**) under stack and db; **`check_k8s_postgres_init_sync`** diffs canonical SQL to both trees and **`diff -qr`** stack vs db **`postgres-init`**.
- App RW grants include **TRUNCATE** to match **`remote_postgres_reinit_bootstrap.py`**.
- **`k.podcastdj.com`**: **`apps/boilerplate-alpha/db`** uses **`?ref=develop`**, removes redundant **`deployment-secret-env.yaml`** patch (env now in Boilerplate base db Deployment).

#### Files Created/Modified

- `infra/k8s/base/stack/postgres-init/setup_management_database.sh`
- `infra/k8s/base/stack/postgres-init/zz_management_grants.sh` (new)
- `infra/k8s/base/stack/postgres-init/create_app_db_users.sh`
- `infra/k8s/base/stack/kustomization.yaml`
- `infra/k8s/base/db/deployment-postgres.yaml`
- `infra/k8s/base/db/kustomization.yaml`
- `infra/k8s/base/db/postgres-init/*` (new mirrored copies)
- `scripts/database/combine-migrations.sh`
- `makefiles/local/Makefile.local.k3d.mk`
- `infra/k8s/INFRA-K8S.md`
- `docs/development/REMOTE-K8S-POSTGRES-REINIT.md`
- `docs/development/REMOTE-K8S-GITOPS.md`
- `scripts/k8s/remote_postgres_reinit_bootstrap.py`
- `k.podcastdj.com/apps/boilerplate-alpha/db/kustomization.yaml`
- `k.podcastdj.com/tmp/boilerplate-alpha-redeploy-secrets-first.TEMP.md`
- Deleted `k.podcastdj.com/apps/boilerplate-alpha/db/deployment-secret-env.yaml`

## Session 2 - 2026-04-06

#### Prompt (Developer)

Single source of truth for combined SQL under k8s (Boilerplate)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **`combine-migrations.sh`** writes combined SQL **only** to **`infra/k8s/base/stack/postgres-init/z_load_*.sql`**, then copies SQL + `*.sh` to **`infra/k8s/base/db/postgres-init/`**; removed **`infra/database/combined/init_database.sql`** and **`infra/management-database/combined/init_management_database.sql`** (removed empty **`management-database/combined/`** directory).
- **`make sync_k8s_postgres_init`** copies stack → db only; **`check_k8s_postgres_init_sync`** diffs stack/db and runs **`verify-migrations-combined.sh`**.
- All consumers (remote bootstrap, Makefiles, Docker Compose mount, CI, docs, skills, ORM comments) now reference k8s **`z_load_*.sql`** paths; **`infra/database/combined/`** retains **`01_create_users.sh`** and **`seed_local_user.sql`** for local Docker only.

#### Files Created/Modified

- `scripts/database/combine-migrations.sh`
- `scripts/database/verify-migrations-combined.sh`
- `makefiles/local/Makefile.local.k3d.mk`
- `scripts/k8s/remote_postgres_reinit_bootstrap.py`
- `makefiles/local/Makefile.local.test.mk`, `Makefile.local.env.mk`
- `infra/docker/local/docker-compose.yml`, `infra/docker/local/INFRA-DOCKER-LOCAL.md`
- `.github/workflows/ci.yml` (single job step: `make check_k8s_postgres_init_sync` includes verify)
- `infra/k8s/INFRA-K8S.md`, `infra/INFRA.md`, `docs/development/REMOTE-K8S-POSTGRES-REINIT.md`
- `AGENTS.md`, `packages/orm/PACKAGES-ORM.md`, `apps/api/src/test/setup.ts`, `packages/management-orm/src/data-source.ts`
- `infra/database/combined/01_create_users.sh` (comment)
- `.cursor/skills/api-testing/SKILL.md`, `roles-schema-sync/SKILL.md`, `generate-data-sync/SKILL.md`, `argocd-gitops-push/SKILL.md`
- `.llm/plans/active/api-tokens/01-api-tokens-backend.md`
- Deleted `infra/database/combined/init_database.sql`, `infra/management-database/combined/init_management_database.sql`

## Session 3 - 2026-04-06

#### Prompt (Developer)

remove it

#### Key Decisions

- Removed **`scripts/k8s/remote_postgres_reinit_bootstrap.py`**; greenfield relies on **`docker-entrypoint-initdb.d`** only; non-greenfield uses **REMOTE-K8S-POSTGRES-REINIT §4** (manual **`psql`**) or PVC wipe.
- **`zz_management_grants.sh`** header comment now references **`Makefile.local.test.mk`** instead of the deleted script.
- **`k.podcastdj.com`** redeploy runbook **B4** points at §4 instead of the script.

#### Files Created/Modified

- Deleted `scripts/k8s/remote_postgres_reinit_bootstrap.py`
- `docs/development/REMOTE-K8S-POSTGRES-REINIT.md`
- `docs/development/REMOTE-K8S-GITOPS.md`
- `infra/k8s/base/db/postgres-init/zz_management_grants.sh`
- `infra/k8s/base/stack/postgres-init/zz_management_grants.sh`
- `k.podcastdj.com/docs/k8s/boilerplate/alpha/BOILERPLATE-REDEPLOY-FULL.md`
- `.llm/history/active/gitops-postgres-initdb/gitops-postgres-initdb.md`
