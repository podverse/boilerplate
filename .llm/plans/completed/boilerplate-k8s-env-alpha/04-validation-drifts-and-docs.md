# 04 — Validation and docs

## Scope (implemented)

| Piece | Location |
|-------|----------|
| Classification | [`scripts/k8s-env/validate-classification.sh`](../../scripts/k8s-env/validate-classification.sh) |
| ConfigMap drift | [`scripts/k8s-env/validate-k8s-env-drift.sh`](../../scripts/k8s-env/validate-k8s-env-drift.sh) |
| Boilerplate doc | [`docs/development/K8S-ENV-RENDER.md`](../../docs/development/K8S-ENV-RENDER.md) |
| GitOps note | [`k.podcastdj.com` docs](../../../../k.podcastdj.com/docs/BOILERPLATE-ALPHA-DEPLOYMENT.md) |

`make alpha_env_validate` / `make k8s_env_validate` run **both** scripts. Drift exits 0 when no output repo is available.

## Verification

```bash
make alpha_env_validate
make alpha_env_validate BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/k.podcastdj.com
```

On a clean tree with `k.podcastdj.com` next to Boilerplate (or `BOILERPLATE_K8S_OUTPUT_REPO` set), validation should pass.
