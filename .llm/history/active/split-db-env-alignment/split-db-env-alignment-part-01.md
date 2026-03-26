# split-db-env-alignment

### Session 1 - 2026-03-24

#### Prompt (Developer)

Local and K8s DB env alignment

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Split `infra/config/env-templates/db.env.example` into `db.env.example` (Postgres superuser only), `db-app.env.example` (app DB `POSTGRES_APP_DB`, roles, `DB_*`), and `db-management.env.example` (management DB + roles).
- Renamed `POSTGRES_DB` to `POSTGRES_APP_DB` in init scripts and classification; Docker Compose and local k3s bridge the official image via `POSTGRES_DB` from `POSTGRES_APP_DB` (`environment` + `--env-file db-app.env` on compose; `workloads.yaml` `secretKeyRef` for k3d).
- Wired Compose `env_file` for api, management-api, postgres, pgadmin; `create-local-secrets.sh` merges three local DB files; `render-k8s-env.sh` merges three templates for postgres workload.
- Updated docs (AGENTS, LOCAL-ENV-OVERRIDES, K8S-ENV-RENDER) and skills (env-templates, local-docker-k3d-alignment).

#### Files Created/Modified

- `infra/config/env-templates/db.env.example`
- `infra/config/env-templates/db-app.env.example`
- `infra/config/env-templates/db-management.env.example`
- `scripts/local-env/setup.sh`
- `scripts/local-env/local-management-db.sh`
- `scripts/infra/k3d/create-local-secrets.sh`
- `scripts/k8s-env/render-k8s-env.sh`
- `makefiles/local/Makefile.local.docker.mk`
- `infra/docker/local/docker-compose.yml`
- `infra/docker/local/api/docker-compose.yml`
- `infra/k8s/env/classification.yaml`
- `infra/k8s/base/stack/workloads.yaml`
- `infra/database/combined/01_create_users.sh`
- `infra/k8s/base/stack/postgres-init/01_create_users.sh`
- `AGENTS.md`
- `docs/development/LOCAL-ENV-OVERRIDES.md`
- `docs/development/K8S-ENV-RENDER.md`
- `.cursor/skills/env-templates/SKILL.md`
- `.cursor/skills/local-docker-k3d-alignment/SKILL.md`
- `.llm/history/active/split-db-env-alignment/split-db-env-alignment-part-01.md`
