# 03 — k.podcastdj.com thin overlays

## Scope

Refactor `apps/boilerplate-alpha/*` so each component overlay **pulls** manifests from the
Boilerplate monorepo **base** via Kustomize remote `resources`, while keeping **GitOps-only**
concerns (image tags, namespace labels, ingress, rendered ConfigMaps/secrets patches) in
k.podcastdj.com.

## Domains vs repo name

The GitOps repository is **k.podcastdj.com**, but **Boilerplate alpha** is exposed on
**metaboost.cc** (alpha) domains on the **same** server/cluster. When editing overlays:

- **`common/ingress.yaml`** (and any TLS/Certificate refs) must use **metaboost.cc** hosts and
  matching cert workflow (ClusterIssuer, DNS-01, etc.) already used for that domain on the
  cluster.
- **Do not** assume podcastdj.com hostnames for Boilerplate alpha unless you explicitly choose
  otherwise; keep ingress and **alpha env overrides** / rendered ConfigMaps aligned.

Internal cluster DNS (`api`, `postgres`, `valkey` Service names) is unchanged; only **external**
hostnames and user-visible URLs follow metaboost.cc.

## Prerequisites

- Boilerplate branch (or tag) with `infra/k8s/base/*` from plan **02** is **pushed** and
  reachable by Argo CD (and by developers running `kubectl kustomize`).
- Inventory from plan **01** lists which files **delete** vs **keep** in GitOps.

## Remote base URL (kubectl / Kustomize)

Use a **full HTTPS git URL** with a **double slash** before the path inside the repo. If you omit
`https://` and start with `github.com/...`, Kustomize treats the string as a **relative filesystem
path** under the overlay directory (broken builds).

**Correct:**

```text
https://github.com/<org>/boilerplate//infra/k8s/base/api?ref=<branch-or-tag>
```

**Wrong (resolved as a local path):**

```text
github.com/<org>/boilerplate/infra/k8s/base/api?ref=main
```

`kubectl kustomize` only succeeds when **`ref` points at a commit that contains**
`infra/k8s/base/<component>/` (plan **02** merged and pushed). Until then, you can validate an
overlay by temporarily pointing `resources` at a **local** path to your Boilerplate clone
(e.g. sibling repo), or by setting `ref` to your feature branch / full commit SHA.

**Match the app repo’s real default branch:** e.g. `podverse/boilerplate` has **HEAD → `develop`**;
`refs/heads/main` may be an older snapshot **without** the current `infra/k8s` tree, which surfaces
as `lstat .../infra: no such file` during remote build. Pin `ref=develop` (or a tag/SHA) consistently
with Argo CD `targetRevision` when applicable.

## Overlay pattern (per component)

Example `kustomization.yaml` shape:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: boilerplate-alpha
resources:
  - https://github.com/<org>/boilerplate//infra/k8s/base/api?ref=<branch-or-tag>
  - configmap.yaml # rendered / hand-maintained per 04
patchesStrategicMerge:
  - deployment-secret-env.yaml
images:
  - name: ghcr.io/podverse/boilerplate/api
    newTag: "0.1.x-alpha.0"
labels:
  - pairs:
      app: boilerplate-api
      environment: alpha
    includeSelectors: true
```

- Use **exact** `ref` policy documented in REMOTE-K8S-GITOPS (branch for dev, tag for prod).
- If port patches are generator-owned (plan 05), list them under `patchesStrategicMerge` in
  stable order.

## Steps

1. **common/** — Usually stays local: namespace, ingress (**metaboost.cc** hosts here).
   Optionally reference a future
   `infra/k8s/base/common` for TLS option / middleware if you align with Podverse
   `base/common`; otherwise leave as GitOps-only.
2. **api, web, management-*, db, keyvaldb** — Remove duplicated Deployment/Service from GitOps
   once remote base is wired; keep kustomization + generated files + any alpha-only patches
   (e.g. resource limits, replicas).
3. **Sync order** — Document that `boilerplate-alpha-common` (or equivalent) should sync
   before workloads if ingress or namespace is required first (existing Argo wave annotations
   optional enhancement).
4. **Validate** each path Argo uses matches `argocd/boilerplate-alpha/*.yaml` `spec.source.path`.

## Verification

From GitOps repo root (with network for remote fetch):

```bash
kubectl kustomize apps/boilerplate-alpha/api --load-restrictor LoadRestrictionsNone
```

- No duplicate Deployments (remote + leftover local).
- Image tag applied; namespace `boilerplate-alpha` present.

## Risks

- **First-time remote fetch** failures in CI without credentials: document developer-only
  validation or use Argo’s cached builds.
- **Ref drift:** Pin tags for production; branch refs for alpha acceptable with team agreement.

## Dependencies

- Plan **02** merged and pushed.
