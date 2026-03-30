# create-super-admin-db-env

**Started:** 2026-03-30  
**Author:** LLM  
**Context:** Unify create-super-admin and local env on classification `DB_*` vars only; remove `MANAGEMENT_DB_*` aliases.

### Session 1 - 2026-03-30

#### Prompt (Developer)

we do not want legacy aliases. assume clean slate is ok

#### Key Decisions

- `create-super-admin.mjs` reads `DB_HOST`, `DB_PORT`, `DB_MANAGEMENT_NAME`, `DB_MANAGEMENT_READ_WRITE_USER`, `DB_MANAGEMENT_READ_WRITE_PASSWORD` only (same as management-api / K8s).
- Removed `MANAGEMENT_DB_*` writes from `setup.sh` and `env-setup-secrets.sh`; management-api `.env` sync uses `DB_MANAGEMENT_NAME` / `DB_MANAGEMENT_READ_WRITE_USER` from `db.env`.
- ENV-REFERENCE: dropped incorrect `MANAGEMENT_DB_PASSWORD` / `hex_32` sentence; `DB_MANAGEMENT_READ_WRITE_PASSWORD` is already covered with other DB role secrets.

#### Files Modified

- scripts/management-api/create-super-admin.mjs
- scripts/local-env/setup.sh
- scripts/env-setup-secrets.sh
- scripts/k8s-env/render_remote_k8s_ports.rb
- docs/development/ENV-REFERENCE.md
- docs/development/REMOTE-K8S-GITOPS.md
- .github/workflows/ci.yml

### Session 2 - 2026-03-30

#### Prompt (Developer)

Remote management super-admin without local .env editing

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Phase A (`DB_*` only) was already done in Session 1; verified.
- Dockerfile copies **`create-super-admin.mjs`** into **`/app/scripts/management-api/`** for in-cluster runs.
- **`k.podcastdj.com`**: **`job-bootstrap-management-super-admin.yaml`** + kustomization entry; env mirrors Deployment + **`DB_MANAGEMENT_SUPERUSER_*`** from **`boilerplate-db-secrets`**; **`ttlSecondsAfterFinished: 86400`**.
- Removed **`MANAGEMENT_DB_*`** from boilerplate **`infra/k8s/base/management-api/03-deployment.yaml`** and alpha **`deployment-ports-and-probes.yaml`**.
- Step 12 expanded: Option A Job (GitOps), B laptop, C ad hoc.

#### Files Modified

- infra/docker/local/management-api/Dockerfile
- infra/k8s/base/management-api/03-deployment.yaml
- scripts/management-api/create-super-admin.mjs
- docs/development/REMOTE-K8S-GITOPS.md
- k.podcastdj.com/apps/boilerplate-alpha/management-api/job-bootstrap-management-super-admin.yaml
- k.podcastdj.com/apps/boilerplate-alpha/management-api/kustomization.yaml
- k.podcastdj.com/apps/boilerplate-alpha/management-api/deployment-ports-and-probes.yaml
