# Kubernetes (k3d/k3s + ArgoCD)

This directory contains a Podverse-style GitOps scaffold for Boilerplate:

- `base/` for reusable manifests,
- `local/` for localhost deployment overlays,
- `alpha/` as a future scaffold,
- root ArgoCD app-of-apps manifests.

## Local first

Local deployment is intentionally self-contained and does not depend on ansible:

- env/secrets source: `make local_env_setup` and `infra/config/local/*.env`,
- cluster runtime: `k3d` (k3s-in-docker),
- controller: ArgoCD,
- fallback apply: `kubectl apply -k infra/k8s/local/stack` for immediate local bring-up.

## Base stack and postgres-init SQL

The base stack (`base/stack/`) builds a ConfigMap for Postgres init from scripts and SQL. Kustomize only allows generator files under the kustomization root, so the init SQL lives under `base/stack/postgres-init/` (init_database.sql, init_management_database.sql). The canonical sources are `infra/database/combined/init_database.sql` and `infra/management-database/combined/init_management_database.sql`. Running `scripts/database/combine-migrations.sh` regenerates those and automatically copies them into `base/stack/postgres-init/`, so the k8s stack stays in sync. For a one-off sync without regenerating (e.g. after a git pull), run `make sync_k8s_postgres_init`. `local_k3d_up` runs the sync automatically before apply. To verify the copies match the canonical files (e.g. in CI), run `make check_k8s_postgres_init_sync`; it fails with instructions if they differ.

## Non-local (future)

`alpha`, `beta`, and `prod` should eventually consume cleartext/encrypted environment material from
`boilerplate-ansible`. Keep those environments separate from local from day one.

## Main files

- `argocd-project.yaml` - shared ArgoCD AppProject.
- `local-application.yaml` - root local app-of-apps.
- `alpha-application.yaml` - future alpha root app-of-apps scaffold.
- `local/apps/stack.yaml` - local child application.
- Non-local SOPS-encrypted Secret manifests are **not** stored under this repo; they live in the GitOps output repository. Render cleartext with [`docs/development/K8S-ENV-RENDER.md`](../../docs/development/K8S-ENV-RENDER.md) (`make alpha_env_render` with `BOILERPLATE_K8S_OUTPUT_REPO`), then encrypt with SOPS and commit in that repo under `secrets/boilerplate-<env>/`.
