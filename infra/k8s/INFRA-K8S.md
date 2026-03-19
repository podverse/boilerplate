# Kubernetes (k3d/k3s + ArgoCD)

This directory contains a Podverse-style GitOps scaffold for Boilerplate:

- `base/` for reusable manifests,
- `local/` for localhost deployment overlays,
- `alpha/` as a future scaffold,
- root ArgoCD app-of-apps manifests.

## Local first

Local deployment is intentionally self-contained and does not depend on ansible:

- env/secrets source: `make local_env_setup` and `infra/config/local/*.env`,
- cluster runtime: `k3d` (k3s-in-docker),
- controller: ArgoCD,
- fallback apply: `kubectl apply -k infra/k8s/local/stack` for immediate local bring-up.

## Non-local (future)

`alpha`, `beta`, and `prod` should eventually consume cleartext/encrypted environment material from
`boilerplate-ansible`. Keep those environments separate from local from day one.

## Main files

- `argocd-project.yaml` - shared ArgoCD AppProject.
- `local-application.yaml` - root local app-of-apps.
- `alpha-application.yaml` - future alpha root app-of-apps scaffold.
- `local/apps/stack.yaml` - local child application.
- `secrets/local/*.enc.yaml` and `secrets/alpha/*.enc.yaml` - SOPS placeholders.
