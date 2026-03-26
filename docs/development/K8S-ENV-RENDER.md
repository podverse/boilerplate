# K8s env render (alpha / beta / prod)

Boilerplate keeps the canonical variable list in [`infra/env/classification/base.yaml`](../../infra/env/classification/base.yaml) with optional overlays in [`infra/env/overrides/`](../../infra/env/overrides/). Each classification **env group** defines **`vars`** with per-key:

- **`kind: literal`** — Not emitted into ConfigMap/Secret by render (typically set in Deployment `env:`).
- **`kind: config`** — Emitted into the **ConfigMap** when present in merged env.
- **`kind: secret`** — Emitted into the **Secret** when present in merged env.
- **`kind: source_only`** — In merged env for this env group but not emitted into that group’s CM/Secret (same role as former `literals_only_in_source`).

`scripts/k8s-env/render-k8s-env.sh` builds a merged env per classification env group with profile **`remote_k8s`** plus `dev/env-overrides/<env>/*.env` (see [ENV-REFERENCE.md](ENV-REFERENCE.md)). On a real write (not `--dry-run`), it **prunes first** by removing only **generator-owned** files: ConfigMaps, plain Secret YAML paths, and per-Deployment **`deployment-secret-env.yaml`** strategic-merge patches, as defined in [`scripts/k8s-env/k8s-env-render-manifest.inc.sh`](../scripts/k8s-env/k8s-env-render-manifest.inc.sh) (same list the renderer writes). That removes stale files when workloads or filenames change without touching `kustomization.yaml` (except generated patch filenames listed there), hand-maintained Deployment stubs, or other YAML in the overlay. Use **`--no-prune`** to skip deletion. **`--dry-run`** never prunes or writes.

### Deployment secret projection (`secretKeyRef`)

Do **not** use **`envFrom.secretRef`** for Boilerplate-rendered secrets in GitOps Deployments: that injects **every** key in the Secret. Instead:

- Keep **`envFrom.configMapRef`** where the overlay app has non-secret config keys (the **`db`** app may have none after **`POSTGRES_DB`** is wired from the Secret in **`deployment-postgres.yaml`**).
- Add **`patchesStrategicMerge: [deployment-secret-env.yaml]`** next to the app’s ConfigMap in the overlay **`kustomization.yaml`**.
- The file **`deployment-secret-env.yaml`** is **generated** by `render_k8s_env.rb --emit secret-env-patch`: a strategic-merge patch that lists **`env[].valueFrom.secretKeyRef`** for each classified **`kind: secret`** key (same key set as **`boilerplate-<suffix>-secrets`** `stringData`), sorted for stable diffs.

**Postgres:** The official image expects **`POSTGRES_USER`** / **`POSTGRES_PASSWORD`**; keep those as **hand-maintained** `env` entries in **`deployment-postgres.yaml`** mapping to **`DB_USER`** / **`DB_PASSWORD`** in **`boilerplate-db-secrets`**. The generated patch still adds **`DB_*`** keys the init scripts need. **`Valkey`** uses only **`VALKEY_PASSWORD`** in the generated patch (no ConfigMap for that component).

Env groups with **no** classified secret keys (e.g. **`web-sidecar`**) do not get **`deployment-secret-env.yaml`**; drift validation skips the path when neither render nor the repo has the file.

The **`db`** env group lists **all** database-related keys under **`env_groups.db.vars`** in classification. Local dev writes them into one **`infra/config/local/db.env`** via **`merge-env --profile local_docker --group db`**. Postgres **role names and passwords** are **secret**; **`DB_HOST_SOURCE_ONLY`** / **`DB_PORT_SOURCE_ONLY`** are **`source_only`**; **`DB_HOST`** / **`DB_PORT`** are **`literal`** (neither group is emitted into the db overlay ConfigMap/Secret by render).

Make targets live in [`makefiles/gitops/Makefile.gitops-env.mk`](../../makefiles/gitops/Makefile.gitops-env.mk)
(included from [`makefiles/local/Makefile.local.mk`](../../makefiles/local/Makefile.local.mk)).

## `BOILERPLATE_K8S_OUTPUT_REPO`

**Render** (`alpha_env_render`, `k8s_env_render`) and **validate** (`alpha_env_validate`, `k8s_env_validate`) require
`BOILERPLATE_K8S_OUTPUT_REPO` set to the **absolute path** of your GitOps repo clone (or any directory you want to emit
into). Export it once per shell or add it to your profile for a fixed path.

**Dry-run** targets (`alpha_env_render_dry_run`, `k8s_env_render_dry_run`) print YAML to stdout only and **do not** require
this variable.

To emit into a local scratch directory, set the variable explicitly (not a default in tooling), for example:

```bash
mkdir -p "$PWD/out/k8s-env/alpha"
export BOILERPLATE_K8S_OUTPUT_REPO="$PWD/out/k8s-env/alpha"
```

## Commands (from repo root)

- `make alpha_env_prepare` — Ensure `~/.config/boilerplate/alpha-env-overrides/` exists and create missing override `.env` files with anchor keys and merged defaults (`remote_k8s` overlay; same generator as `make local_env_prepare`; existing files are not overwritten).
- `make alpha_env_link` — Symlink `dev/env-overrides/alpha/*.env` → existing files under `~/.config/boilerplate/alpha-env-overrides/` so render reads the durable home copy.
- `make alpha_env_clean` — Remove `dev/env-overrides/alpha/*.env` in the repo (symlinks to home in normal use; real files there would be removed too). Does **not** delete `~/.config/boilerplate/alpha-env-overrides/`. Run `make alpha_env_link` again before render if you use home overrides.
- `make alpha_env_prepare_link` — `prepare` then `link` (same idea as local prepare + link).
- `make alpha_env_render` — Emit ConfigMaps, **`deployment-secret-env.yaml`** patches under each overlay app directory, and cleartext Secrets under `secrets/boilerplate-<env>/plain/` (requires `BOILERPLATE_K8S_OUTPUT_REPO`). Prunes generator-owned paths first (see above).
- `make alpha_env_render_dry_run` — Print rendered YAML only (no writes, no prune; no output repo required).
- `make alpha_env_validate` — [`validate-classification.sh`](../../scripts/k8s-env/validate-classification.sh) + [`validate-k8s-env-drift.sh`](../../scripts/k8s-env/validate-k8s-env-drift.sh) (requires `BOILERPLATE_K8S_OUTPUT_REPO`).

Suggested workflow: preview rendered YAML, validate (classification + ConfigMap/patch drift vs the clone), then write files into the output repo.

Examples with an explicit GitOps path:

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/your-gitops-repo

make alpha_env_render_dry_run
make alpha_env_validate
make alpha_env_render
```

(`alpha_env_render_dry_run` does not require `BOILERPLATE_K8S_OUTPUT_REPO`; you can run it before the `export` if you only want stdout.)

Generic env name (`beta` / `prod` when overlays exist):

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/your-gitops-repo

make k8s_env_render_dry_run K8S_ENV=beta
make k8s_env_validate K8S_ENV=beta
make k8s_env_render K8S_ENV=beta
```

`make k8s_env_clean K8S_ENV=<name>` removes `dev/env-overrides/<name>/*.env` (repo symlinks in normal use); home `~/.config/boilerplate/<name>-env-overrides/` is unchanged. `make alpha_env_clean` matches `make k8s_env_clean` with default `K8S_ENV=alpha`.

Scripts: [`prepare-k8s-env-overrides.sh`](../../scripts/k8s-env/prepare-k8s-env-overrides.sh) (delegates to [`prepare-home-env-overrides.sh`](../../scripts/env-overrides/prepare-home-env-overrides.sh)), [`link-k8s-env-overrides.sh`](../../scripts/k8s-env/link-k8s-env-overrides.sh). Canonical defaults: `infra/env/classification/`. Per-env working files: `dev/env-overrides/alpha/*.env` (symlinks to home after link, when those files exist under `~/.config/boilerplate/alpha-env-overrides/`).

Optional: set `BOILERPLATE_HOME_ENV_OVERRIDES_DIR` when running `link-k8s-env-overrides.sh` outside the default home path.

## Validation and drift

1. **Classification** — Every key under each env group’s **`vars`** in [`infra/env/classification/base.yaml`](../../infra/env/classification/base.yaml) must have a valid **`kind`** and **`default`** (overlap rules enforced by
   [`validate-classification.sh`](../../scripts/k8s-env/validate-classification.sh)). Env groups with `no_env_from` use
   only `literal` / `source_only` kinds (no `config`/`secret`).

2. **ConfigMap and patch drift** — [`validate-k8s-env-drift.sh`](../../scripts/k8s-env/validate-k8s-env-drift.sh) renders into a
   temp directory with the same inputs as `make alpha_env_render`, then byte-compares each generated ConfigMap and each
   **`deployment-secret-env.yaml`** to the committed file under `apps/boilerplate-<env>/`. ConfigMap paths and patch paths match
   [`k8s-env-render-manifest.inc.sh`](../../scripts/k8s-env/k8s-env-render-manifest.inc.sh). If **both** render and the repo omit a ConfigMap or patch (env group with no config or no secret keys), that path is skipped. **Secret values** under `secrets/.../plain/` are not compared (overrides and SOPS). The GitOps repo path must be set via `BOILERPLATE_K8S_OUTPUT_REPO` (or `--output-repo`); if the
   overlay `apps/boilerplate-<env>/` is missing, validation **fails** (exit 1).

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/your-gitops-repo
make alpha_env_validate
```

## After render

1. Encrypt Secret manifests with SOPS (do not commit cleartext). Follow your GitOps repo’s deployment checklist (and [REMOTE-K8S-GITOPS.md](REMOTE-K8S-GITOPS.md) for the overall flow).
2. Commit ConfigMaps under `apps/boilerplate-<env>/*/configmap*.yaml` and generated **`deployment-secret-env.yaml`** next to each patched Deployment.
3. Ensure overlay **`kustomization.yaml`** lists **`patchesStrategicMerge`** for **`deployment-secret-env.yaml`** where that app’s env group has secret keys (api, management-api, db, valkey for Boilerplate alpha).
4. Push Git so Argo CD syncs.

## Requirements

- Ruby (stdlib YAML) for `render_k8s_env.rb`, `validate-classification.sh`, and drift (via `render-k8s-env.sh`).
