# K8s env render (alpha / beta / prod)

Boilerplate keeps the canonical variable list in `.env.example` files and classifies each key as
**config** (ConfigMap) or **secret** (Secret) in
[`infra/k8s/env/classification.yaml`](../../infra/k8s/env/classification.yaml).
Postgres **role names** (`DB_READ_USERNAME`, `POSTGRES_READ_USER`, etc.) are **secret**, matching
Podverse K8s (cleartext ConfigMaps are non-sensitive only).

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

- `make alpha_env_prepare` — Seed `~/.config/boilerplate/alpha-env-overrides/*.env` from `dev/env-overrides/examples/*.env.example` when missing (same canonical examples as local; home-first; same idea as `make local_env_prepare`).
- `make alpha_env_link` — Symlink `dev/env-overrides/alpha/*.env` → `~/.config/boilerplate/alpha-env-overrides/` so render reads the durable home copy.
- `make alpha_env_prepare_link` — `prepare` then `link` (same idea as local prepare + link).
- `make alpha_env_render` — Emit ConfigMaps into the output repo and cleartext Secrets under `secrets/boilerplate-<env>/plain/` (requires `BOILERPLATE_K8S_OUTPUT_REPO`).
- `make alpha_env_render_dry_run` — Print rendered YAML only (no writes; no output repo required).
- `make alpha_env_validate` — [`validate-classification.sh`](../../scripts/k8s-env/validate-classification.sh) + [`validate-k8s-env-drift.sh`](../../scripts/k8s-env/validate-k8s-env-drift.sh) (requires `BOILERPLATE_K8S_OUTPUT_REPO`).

Suggested workflow: preview rendered YAML, validate (classification + ConfigMap drift vs the clone), then write files into the output repo.

Examples with an explicit GitOps path:

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/k.podcastdj.com

make alpha_env_render_dry_run
make alpha_env_validate
make alpha_env_render
```

(`alpha_env_render_dry_run` does not require `BOILERPLATE_K8S_OUTPUT_REPO`; you can run it before the `export` if you only want stdout.)

Generic env name (`beta` / `prod` when overlays exist):

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/k.podcastdj.com

make k8s_env_render_dry_run K8S_ENV=beta
make k8s_env_validate K8S_ENV=beta
make k8s_env_render K8S_ENV=beta
```

Scripts: [`prepare-k8s-env-overrides.sh`](../../scripts/k8s-env/prepare-k8s-env-overrides.sh) (delegates to [`prepare-home-env-overrides.sh`](../../scripts/env-overrides/prepare-home-env-overrides.sh)), [`link-k8s-env-overrides.sh`](../../scripts/k8s-env/link-k8s-env-overrides.sh). Shared examples: `dev/env-overrides/examples/`. Per-env working files: `dev/env-overrides/alpha/*.env` (symlinks to home after link).

Optional: set `BOILERPLATE_HOME_ENV_OVERRIDES_DIR` when running `link-k8s-env-overrides.sh` outside the default home path.

## Validation and drift

1. **Classification** — Every key in `.env.example` files referenced by
   [`classification.yaml`](../../infra/k8s/env/classification.yaml) must be listed with tier `config` or `secret`
   (or listed under `literals` / `literals_only_in_source`, or workloads with `no_env_from` must only use literals).

2. **ConfigMap drift** — [`validate-k8s-env-drift.sh`](../../scripts/k8s-env/validate-k8s-env-drift.sh) renders into a
   temp directory with the same inputs as `make alpha_env_render`, then byte-compares each generated ConfigMap to the
   committed file under `apps/boilerplate-<env>/` in the output repo. **Secrets are not compared** (values depend on
   overrides and SOPS). The GitOps repo path must be set via `BOILERPLATE_K8S_OUTPUT_REPO` (or `--output-repo`); if the
   overlay `apps/boilerplate-<env>/` is missing, validation **fails** (exit 1).

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/k.podcastdj.com
make alpha_env_validate
```

## After render

1. Encrypt Secret manifests with SOPS (do not commit cleartext). See
   `k.podcastdj.com` docs for alpha deployment.
2. Commit ConfigMaps under `apps/boilerplate-<env>/*/configmap*.yaml`.
3. Push Git so Argo CD syncs.

## Requirements

- Ruby (stdlib YAML) for `render_k8s_env.rb`, `validate-classification.sh`, and drift (via `render-k8s-env.sh`).
