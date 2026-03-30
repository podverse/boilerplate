# Execution order — boilerplate K8s env (alpha / future beta-prod)

## Phases

1. **01-classification** — [`01-classification-and-contract.md`](01-classification-and-contract.md)  
   - `infra/k8s/env/classification.yaml` is the key contract.

2. **02-scripts** — [`02-boilerplate-render-scripts.md`](02-boilerplate-render-scripts.md)  
   - `scripts/k8s-env/*.sh`, Make targets.

3. **03-kpcastdj** — [`03-kpcastdj-manifests-and-sops.md`](03-kpcastdj-manifests-and-sops.md)  
   - Patches under `k.podcastdj.com/apps/alpha-boilerplate/`, secrets README.

4. **04-validation** — [`04-validation-drifts-and-docs.md`](04-validation-drifts-and-docs.md)  
   - Drift script + docs.

## Beta / prod (later)

- Same scripts with `ENV=beta` or `ENV=prod` and `OUTPUT_REPO` pointing at overlays when they exist.
- New `secrets/beta-boilerplate/` (etc.) without changing script logic.

## Parallelism

- Sequential: 01 → 02 → 03 → 04.
