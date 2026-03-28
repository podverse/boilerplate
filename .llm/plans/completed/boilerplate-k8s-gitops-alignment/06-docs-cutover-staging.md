# 06 — Documentation and cluster cutover

## Scope

Update developer and operator docs for the new **two-repo** layout (bases in Boilerplate,
overlays in GitOps), remote Kustomize URLs, render + port workflows, and a safe **cutover**
checklist for a live cluster.

## Documentation updates

1. [docs/development/REMOTE-K8S-GITOPS.md](../../../../docs/development/REMOTE-K8S-GITOPS.md)
   - Remote base URL template (`github.com/.../infra/k8s/base/...?ref=...`)
   - Requirement for `kubectl kustomize --load-restrictor LoadRestrictionsNone`
   - Order: push Boilerplate branch/tag → update GitOps `ref` → `make alpha_env_render` → port
     render → SOPS → commit → Argo sync
2. [infra/k8s/INFRA-K8S.md](../../../../infra/k8s/INFRA-K8S.md)
   - Describe `infra/k8s/base/*` vs `base/stack` (local) relationship
   - Local k3d decision from plan **01** (refactor vs defer)
3. [docs/development/K8S-ENV-RENDER.md](../../../../docs/development/K8S-ENV-RENDER.md)
   - Cross-link port sync targets (plan **05**)
4. **Domain story** — State clearly: GitOps repo **k.podcastdj.com**; Boilerplate alpha
   **public URLs** on **metaboost.cc** (alpha); same cluster; DNS/TLS/ingress and
   `alpha_env_render` overrides must all reference the metaboost.cc host set.
5. **alpha-application.yaml** — Either:
   - Populate `infra/k8s/alpha/apps/` with real Argo Applications pointing at **this** repo
     (if you want Boilerplate-hosted app-of-apps), **or**
   - Repoint/remove misleading `alpha-application.yaml` and state clearly that production
     Argo lives in k.podcastdj.com only.

Prefer **one** canonical story to avoid duplicate conflicting Application sources.

## Cutover checklist (staging first)

1. Backup current `apps/boilerplate-alpha` revision (git tag).
2. Deploy Boilerplate bases on a **non-main** ref; point one component overlay at it; sync;
   verify pods.
3. Roll remaining components; watch Argo sync waves and health.
4. Confirm TLS ingress for **metaboost.cc** hosts, API health checks, web runtime config,
   management stack (CORS/cookies match those hosts).
5. Roll forward `ref` to tag for stability; document rollback (revert GitOps commit + sync).

## Verification

- Peer review doc PR.
- Staging cluster: Argo apps Healthy; smoke test HTTP endpoints.

## Dependencies

- Phases **02–05** complete or at least bases + overlays + render stable.

## Completion

**Done 2026-03-27:** Plan set lives under `.llm/plans/completed/boilerplate-k8s-gitops-alignment/`.
No master index under `.llm/plans/active/boilerplate/` was present.
