# Plan 37: k3d + ArgoCD Deployment Foundation (local now, alpha-ready)

## Scope

Design and implement a Podverse-style GitOps deployment foundation for Boilerplate that:

- deploys a fully working stack to localhost using `k3d` (k3s-in-docker),
- uses ArgoCD as the deployment controller (app-of-apps pattern),
- keeps `local` and `alpha` environments separate from day one,
- uses `SOPS + age` for encrypted Kubernetes Secrets to stay alpha-ready.

This plan adds deployment scaffolding, automation, and docs. It does not perform alpha rollout.

## Steps

1. Create Kubernetes GitOps structure in Boilerplate:
   - `infra/k8s/base/`
   - `infra/k8s/local/`
   - `infra/k8s/alpha/` (scaffold only)
   - `infra/k8s/local/apps/` and `infra/k8s/alpha/apps/`
2. Add base manifests for:
   - `api`, `management-api`, `web`, `web-sidecar`, `management-web`,
     `management-web-sidecar`, `postgres`, `valkey`, and shared `common`.
3. Add local overlays for k3d:
   - namespace/config differences,
   - local ingress/service patches,
   - image/tag overrides suitable for local development and testing.
4. Add ArgoCD bootstrap for local:
   - install ArgoCD in cluster,
   - create root Application (`local-application.yaml`),
   - include child Applications under `infra/k8s/local/apps/`.
5. Add local developer workflow scripts and Make targets:
   - cluster create/destroy,
   - ArgoCD install/bootstrap,
   - sync/wait checks and friendly endpoint output.
6. Add SOPS + age secret workflow:
   - environment-specific encrypted Secret files for `local` and `alpha`,
   - key setup docs/scripts,
   - clear separation so local and alpha secrets do not overlap.
7. Add docs:
   - architecture and directory layout,
   - local bring-up/tear-down flow,
   - alpha-ready boundaries and future rollout notes.

## Key Files

- `infra/k8s/INFRA-K8S.md`
- `infra/k8s/local-application.yaml`
- `infra/k8s/alpha-application.yaml`
- `infra/k8s/base/**`
- `infra/k8s/local/**`
- `infra/k8s/alpha/**`
- `scripts/k8s/local-up.sh`
- `scripts/k8s/local-down.sh`
- `scripts/k8s/bootstrap-argocd.sh`
- `scripts/k8s/sops/generate-age-key.sh`
- `makefiles/local/Makefile.local.k3d.mk`
- `Makefile`
- `infra/INFRA.md`
- `docs/development/K3D-ARGOCD-LOCAL.md`

## Verification

1. From repo root, local deployment flow can:
   - create a fresh k3d cluster,
   - install ArgoCD,
   - deploy Boilerplate workloads via ArgoCD,
   - report healthy/synced app status.
2. `web`, `api`, `management-web`, and `management-api` are reachable as designed for local dev.
3. `postgres` and `valkey` are running and connected to app services.
4. `alpha` manifests exist as separate scaffolding and are not coupled to local values.
5. Secrets are stored as encrypted SOPS manifests with separate local/alpha files.

## Notes

- Follow Podverse layout and conventions where practical:
  - `infra/k8s/base` + environment overlays,
  - ArgoCD app-of-apps,
  - SOPS encrypted secrets in git.
- Keep alpha deployment execution out of this plan; only establish alpha-ready structure.
