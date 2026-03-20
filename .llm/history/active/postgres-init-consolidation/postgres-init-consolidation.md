# Feature: postgres-init-consolidation

## Metadata
- Started: 2026-03-19
- Context: Keep k8s base/stack/postgres-init SQL in sync with canonical combined SQL.

## Sessions

### Session 1 - 2026-03-19

#### Prompt (Developer)

Consolidate postgres-init SQL and keep in sync. Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- `scripts/database/combine-migrations.sh` now copies combined SQL into `infra/k8s/base/stack/postgres-init/` after generating, so one run keeps canonical and k8s copies in sync.
- `make sync_k8s_postgres_init` kept for one-off sync (e.g. after git pull).
- `make check_k8s_postgres_init_sync` added to fail if canonical and postgres-init copies differ; wired into `validate_ci` and CI workflow so drift is caught.

#### Files Created/Modified

- scripts/database/combine-migrations.sh (comment + sync cp at end)
- infra/k8s/INFRA-K8S.md (docs: combine script sync, sync_k8s_postgres_init, check_k8s_postgres_init_sync)
- makefiles/local/Makefile.local.k3d.mk (check_k8s_postgres_init_sync target)
- makefiles/local/Makefile.local.test.mk (validate_ci runs check_k8s_postgres_init_sync)
- .github/workflows/ci.yml (step: Check k8s postgres-init in sync with canonical SQL)
