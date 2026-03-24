# Summary — boilerplate K8s env automation

## Scope

- **Repos:** Boilerplate (source of truth, scripts, classification); `k.podcastdj.com` (alpha overlays, committed ConfigMaps, SOPS secrets).
- **Environments:** `alpha` implemented; `beta` / `prod` use the same `ENV` flag and directory conventions.
- **Split:** Non-sensitive → ConfigMap; sensitive → Secret; keys injected via Deployment `env` literals are excluded from CM/Secret.

## Artifacts

| Location | Purpose |
|----------|---------|
| `infra/k8s/env/classification.yaml` | Per-workload keys, tier (config/secret), literals |
| `scripts/k8s-env/` | prepare, link, render, validate |
| `dev/env-overrides/alpha/` | Example override files for alpha |
| `k.podcastdj.com/apps/alpha-boilerplate/*/configmap.yaml` | Rendered ConfigMaps (where non-empty) |
| `k.podcastdj.com/secrets/alpha-boilerplate/*.enc.yaml` | SOPS Secret manifests |

## Decisions

- Resource names: `boilerplate-<component>-config`, `boilerplate-<component>-secrets` (namespace isolates envs).
- Web / management-web **main** containers only use literals from `.env.example` (runtime sidecar provides config); **no envFrom** when there are no remaining keys.
