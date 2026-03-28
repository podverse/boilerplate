# 04 — Classification render and generator-owned files

**Status:** Completed 2026-03-27 (port-patch hooks for plan **05**; docs; validate passes vs GitOps clone).

## Scope

Keep **`make alpha_env_render`** and drift validation as the single pipeline for ConfigMaps and
`deployment-secret-env.yaml`. Extend only where new **generator-owned** artifacts are added
(e.g. port patches from plan **05**). Avoid breaking
[`scripts/k8s-env/k8s-env-render-manifest.inc.sh`](../../../../scripts/k8s-env/k8s-env-render-manifest.inc.sh)
prune behavior.

## Current behavior (reference)

- Workloads: `db`, `valkey`, `api`, `web-sidecar`, `management-api`, `management-web-sidecar`
- Overlay dir mapping: `valkey` → `keyvaldb` folder in GitOps
- Owned paths: per-workload `configmap*.yaml`, `deployment-secret-env.yaml`, and
  `secrets/boilerplate-<env>/plain/boilerplate-<suffix>-secrets.yaml`
- Docs: [docs/development/K8S-ENV-RENDER.md](../../../../docs/development/K8S-ENV-RENDER.md)

## Integration with remote bases

- **Public hostnames:** GitOps paths live under **k.podcastdj.com**, but alpha **URLs in
  rendered config** must match **metaboost.cc** (alpha) ingress and DNS (see
  [00-SUMMARY.md](00-SUMMARY.md)). Validate CORS, cookie domain, and base URLs after each
  render when hosts change.
- **Rendered ConfigMaps** remain in GitOps overlay directories; bases should not hardcode the
  same keys unless intentionally structural (avoid drift).
- If base ConfigMap is **removed** in favor of render-only ConfigMap, ensure `kustomization.yaml`
  still lists the rendered file and `configMapRef` names match Deployment `envFrom`.
- **`literal`** keys (e.g. `API_PORT`) that today live only in Deployment `env:` may move to
  **generated port patches** (plan 05); classification defaults still define canonical values.

## Steps

1. After plan **05** finalizes output filenames, update:
   - [`scripts/k8s-env/k8s-env-render-manifest.inc.sh`](../../../../scripts/k8s-env/k8s-env-render-manifest.inc.sh)
     — append owned relpaths if port patches are generated next to deployments.
   - [`scripts/k8s-env/render-k8s-env.sh`](../../../../scripts/k8s-env/render-k8s-env.sh) /
     [`scripts/k8s-env/render_k8s_env.rb`](../../../../scripts/k8s-env/render_k8s_env.rb) —
     invoke port patch emission or call a sibling script from the same make target.
   - [`scripts/k8s-env/validate-k8s-env-drift.sh`](../../../../scripts/k8s-env/validate-k8s-env-drift.sh) —
     byte-compare new artifacts the same way as ConfigMaps.
2. Extend [`makefiles/gitops/Makefile.gitops-env.mk`](../../../../makefiles/gitops/Makefile.gitops-env.mk)
   if new targets are needed (or fold port step into `alpha_env_render`).
3. Update [docs/development/K8S-ENV-RENDER.md](../../../../docs/development/K8S-ENV-RENDER.md)
   with any new owned paths and ordering (render before SOPS encrypt).

## Verification

```bash
export BOILERPLATE_K8S_OUTPUT_REPO=/absolute/path/to/k.podcastdj.com
make alpha_env_render_dry_run
make alpha_env_validate
make alpha_env_render
```

- Prune removes **only** generator-owned files; hand-maintained ingress unchanged.
- Drift validation passes against committed GitOps files.

## Dependencies

- Plan **05** decided output shape **or** this plan implements “hooks only” and 05 adds paths
  in same PR.

## Anti-patterns

- Do not use `envFrom.secretRef` for Boilerplate-rendered secrets (inject per-key via
  strategic merge — existing rule).
- Do not add secrets to ConfigMaps.
