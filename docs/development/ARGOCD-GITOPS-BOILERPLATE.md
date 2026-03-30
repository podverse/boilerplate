# Argo CD and Boilerplate (canonical GitOps story)

This repository ships **Kustomize bases** under `infra/k8s/base/<component>/`, **local** k3d
scaffold under `infra/k8s/local/`, and **env render** tooling (`make alpha_env_render`, …). It
does **not** ship the Argo CD `Application` manifests that sync non-local environments to a
cluster.

## Where production Applications live

For **remote** clusters (alpha, staging, production), treat your **GitOps repository** as the only
source of truth for:

- Argo CD **`Application`** and **`AppProject`** CRs (paths such as `argocd/boilerplate-<env>/`),
- per-environment **Kustomize overlays** (`apps/boilerplate-<env>/`),
- **SOPS-encrypted** secrets committed to Git.

The Podverse reference GitOps repo is **k.podcastdj.com** (private org layout); forks should mirror
that pattern under their own repo and branch that Argo CD’s `targetRevision` tracks.

**Do not** `kubectl apply` a root `Application` from this repo expecting it to drive alpha: the
former `infra/k8s/alpha-application.yaml` pointed at `infra/k8s/alpha/apps`, which is a **placeholder**
only (no child Applications). That file was removed to avoid a misleading duplicate source of truth.

## Optional: app-of-apps from this repo

If your org wants a Boilerplate-hosted app-of-apps, add real `Application` YAML under
`infra/k8s/alpha/apps/` (or another path), wire a new root `Application` deliberately, and document
the branch Argo CD should track. The open-source default is **GitOps-repo-only** Applications, as
described in [REMOTE-K8S-GITOPS.md](REMOTE-K8S-GITOPS.md).

## Related

- [REMOTE-K8S-GITOPS.md](REMOTE-K8S-GITOPS.md) — clone, render, SOPS, sync order.
- [GITOPS-CUTOVER-STAGING-CHECKLIST.md](GITOPS-CUTOVER-STAGING-CHECKLIST.md) — staging rollout steps.
- [infra/k8s/INFRA-K8S.md](../../infra/k8s/INFRA-K8S.md) — layout of `base/`, `local/`, `alpha/`.
