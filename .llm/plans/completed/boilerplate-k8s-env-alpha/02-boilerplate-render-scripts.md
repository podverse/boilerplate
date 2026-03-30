# 02 — Boilerplate render scripts

## Scope

- [`scripts/k8s-env/prepare-k8s-env-overrides.sh`](../../../../scripts/k8s-env/prepare-k8s-env-overrides.sh) → [`scripts/env-overrides/prepare-home-env-overrides.sh`](../../../../scripts/env-overrides/prepare-home-env-overrides.sh)
- [`scripts/k8s-env/link-k8s-env-overrides.sh`](../../../../scripts/k8s-env/link-k8s-env-overrides.sh)
- [`scripts/k8s-env/render-k8s-env.sh`](../../../../scripts/k8s-env/render-k8s-env.sh)
- [`scripts/k8s-env/lib/env-merge.sh`](../../../../scripts/k8s-env/lib/env-merge.sh)
- [`scripts/k8s-env/render_k8s_env.rb`](../../../../scripts/k8s-env/render_k8s_env.rb)
- Make targets in [`makefiles/gitops/Makefile.gitops-env.mk`](../../../../makefiles/gitops/Makefile.gitops-env.mk) (included from [`Makefile.local.mk`](../../../../makefiles/local/Makefile.local.mk))

## Behavior

- `ENV=alpha|beta|prod` selects `dev/env-overrides/<env>/*.env` (working files; examples are shared under `dev/env-overrides/examples/`) and `~/.config/boilerplate/<env>-env-overrides/`.
- `render-k8s-env.sh` reads classification, merged env, writes ConfigMaps to `OUTPUT_REPO` and cleartext Secrets to `secrets/<env>-boilerplate/plain/` for SOPS.
- `BOILERPLATE_HOME_ENV_OVERRIDES_DIR` overrides the home directory for `link-k8s-env-overrides.sh` (optional).
- `BOILERPLATE_K8S_OUTPUT_REPO` or `make ... BOILERPLATE_K8S_OUTPUT_REPO=/path` sets the GitOps repo root (required for render/validate; no implicit sibling or `out/` default).

## Verification

```bash
./scripts/k8s-env/render-k8s-env.sh --env alpha --dry-run
./scripts/k8s-env/validate-classification.sh
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/gitops-repo
make alpha_env_validate
make alpha_env_render_dry_run
```
