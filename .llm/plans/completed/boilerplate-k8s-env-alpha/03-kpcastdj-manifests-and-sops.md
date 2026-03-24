# 03 — k.podcastdj.com manifests and SOPS

## Scope (implemented)

Git repo: **sibling of Boilerplate** — `k.podcastdj.com` (paths below are from that repo root).

- Deployments under `apps/boilerplate-alpha/`: `configMapRef` + `secretRef` where applicable; legacy
  single `*-env` Secret names removed.
- [`secrets/boilerplate-alpha/README.md`](../../../../../k.podcastdj.com/secrets/boilerplate-alpha/README.md)
- [`secrets/boilerplate-beta/README.md`](../../../../../k.podcastdj.com/secrets/boilerplate-beta/README.md) (stub)

## Workload → K8s env refs

| Overlay folder | ConfigMap(s) | Secret(s) | Notes |
|----------------|--------------|-----------|--------|
| `api/` | `boilerplate-api-config` | `boilerplate-api-secrets` | DB/Valkey host ports via Deployment `env:` |
| `management-api/` | `boilerplate-management-api-config` | `boilerplate-management-api-secrets` | Same pattern |
| `web/` | `boilerplate-web-sidecar-config` | — | Main `web` container: literals only |
| `management-web/` | `boilerplate-management-web-sidecar-config` | — | Main `management-web` container: literals only |
| `db/` | `boilerplate-db-config` | `boilerplate-db-secrets` | + literal `MANAGEMENT_DB_NAME` |
| `keyvaldb/` | — | `boilerplate-valkey-secrets` | Password only |

ConfigMaps are **resources** in each overlay `kustomization.yaml`. Secrets are **not** in kustomize
(apply encrypted YAML separately; see README).

## SOPS

- Render cleartext in Boilerplate: `make alpha_env_render` → writes under
  `k.podcastdj.com/secrets/boilerplate-alpha/plain/` (directory is under `secrets/`, typically gitignored).
- Encrypt before any commit of secret material, e.g.  
  `sops -e -i secrets/boilerplate-alpha/plain/boilerplate-api-secrets.yaml`  
  (or your team’s `.sops.yaml` / age recipients flow).
- Never commit plaintext secrets.

## Verification

From `k.podcastdj.com` repo root:

```bash
kubectl kustomize apps/boilerplate-alpha/api
kubectl kustomize apps/boilerplate-alpha/db
kubectl kustomize apps/boilerplate-alpha/keyvaldb
kubectl kustomize apps/boilerplate-alpha/management-api
kubectl kustomize apps/boilerplate-alpha/web
kubectl kustomize apps/boilerplate-alpha/management-web
kubectl kustomize apps/boilerplate-alpha/common
```

## Argo CD

Applications under `argocd/boilerplate-alpha/` sync app manifests; **Secrets** are usually applied
out-of-band (decrypt + `kubectl apply`) per [`BOILERPLATE-ALPHA-DEPLOYMENT.md`](../../../../../k.podcastdj.com/docs/BOILERPLATE-ALPHA-DEPLOYMENT.md).
