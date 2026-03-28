# 02 — Boilerplate base Kustomize

## Scope

Add **per-component** Kustomize bases under the Boilerplate monorepo so GitOps overlays can
reference them via remote URLs (Podverse pattern:
`github.com/org/repo/infra/k8s/base/api?ref=branch`).

## Design rules

- **Naming:** Resource `metadata.name` values must stay compatible with existing Services
  (`api`, `postgres`, `valkey`, etc.) unless migration explicitly renames DNS in env and
  ingress—prefer **no rename** for first iteration.
- **Images:** Use full image names matching current GitOps `images:` entries (e.g.
  `ghcr.io/podverse/boilerplate/api`); overlays supply `newTag` only.
- **ConfigMap:** Base may ship a **minimal** non-secret ConfigMap or omit data that is entirely
  alpha-specific; do not duplicate large env blocks that **render** already emits into GitOps.
  Coordinate with plan 04: either base has empty/minimal CM and overlay always includes
  rendered CM, or base documents which keys are structural only.
- **Secrets:** No plaintext in base; `env` secret refs use names expected by rendered
  `deployment-secret-env.yaml` (e.g. `boilerplate-api-secrets`).
- **Init containers:** Keep `wait-postgres` / `wait-valkey` patterns; internal ports **5432**
  and **6379** are cluster defaults—document if they ever diverge from Service definitions.
- **Formatting:** Follow Podverse k8s Prettier rules if this repo’s `.prettierrc` includes k8s
  overrides; otherwise match existing Boilerplate yaml style under `infra/k8s`.

## Suggested directory tree

```
infra/k8s/base/
  api/
    kustomization.yaml
    01-configmap.yaml    # optional stub
    02-service.yaml
    03-deployment.yaml
  web/
    kustomization.yaml
    ... (two deployments, two services)
  management-api/
  management-web/
  db/
  keyvaldb/
```

Adjust filenames to match team preference; **kustomization.yaml** must list all resources.

## Steps

1. For each component, **copy** current GitOps Deployment/Service YAML into the base and strip
   **alpha-only** bits: `namespace` (set in overlay), image **tags**, host-specific env, TLS
   ingress (ingress stays under `common/`).
2. Ensure **selector labels** match Service selectors after overlay `labels` with
   `includeSelectors: true` (mirror Podverse alpha kustomizations).
3. Add a **short** `infra/k8s/base/README.md` is **not allowed** (single README at repo root);
   instead extend [infra/k8s/INFRA-K8S.md](../../../../infra/k8s/INFRA-K8S.md)
   or add `INFRA-K8S-BASE.md` per documentation-conventions.
4. Open PR / push branch so GitOps remote URLs can use a **real** `ref` (branch or tag).

## Verification

- From Boilerplate root:

```bash
kubectl kustomize infra/k8s/base/api --load-restrictor LoadRestrictionsNone
```

- Repeat per component; output must include Deployment + Service with no `error` from
  Kustomize.
- Optional: CI job `kubectl kustomize` each base on PR (lightweight guard).

## Dependencies

- Plan **01** completed (file list and naming locked).

## Downstream

- Plan **03** switches GitOps to `resources:` remote bases using this tree.
