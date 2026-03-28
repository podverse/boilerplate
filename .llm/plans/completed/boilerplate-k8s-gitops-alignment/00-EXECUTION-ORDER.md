# Execution order — boilerplate-k8s-gitops-alignment

Run phases **in order**. Do not start phase N+1 until phase N is complete and verified.

## Phase 1 — Inventory and layout lock

**Plan:** [01-inventory-and-target-layout.md](01-inventory-and-target-layout.md)

- Produce authoritative mapping of current `k.podcastdj.com/apps/boilerplate-alpha/*` files
  to future **base** (Boilerplate repo) vs **overlay** (GitOps repo).
- Decide **local k3d** scope: refactor `infra/k8s/local/stack` to compose new bases vs defer
  (document as follow-up).

**Verify:** Written sign-off in `00-SUMMARY.md` decisions section (local k3d choice).

## Phase 2 — Boilerplate per-component bases

**Plan:** [02-boilerplate-base-kustomize.md](02-boilerplate-base-kustomize.md)

- Add `infra/k8s/base/<component>/` with Kustomize resources aligned to Podverse patterns.
- Image names and selectors must match what GitOps `images:` entries expect.

**Verify:** `kubectl kustomize infra/k8s/base/api` (and each component) from Boilerplate root
  with `--load-restrictor LoadRestrictionsNone` if remote refs appear later.

## Phase 3 — Thin GitOps overlays (k.podcastdj.com)

**Plan:** [03-kpodcastdj-thin-overlays.md](03-kpodcastdj-thin-overlays.md)

- Replace inlined Deployment/Service YAML with `resources:` pointing at Boilerplate monorepo
  URL + `ref`.
- Preserve `common/` (namespace, ingress with **metaboost.cc** alpha hosts), Argo app paths,
  sync ordering.

**Verify:** `kubectl kustomize apps/boilerplate-alpha/<component>` from GitOps clone with
  `--load-restrictor LoadRestrictionsNone`; Argo UI diff optional.

## Phase 4 — Classification render and owned files

**Plan:** [04-classification-render-and-owned-files.md](04-classification-render-and-owned-files.md)

- Extend render manifest / drift validation if new generator-owned files are introduced
  (e.g. port patches from phase 5).
- Keep `deployment-secret-env.yaml` and ConfigMap generation behavior documented.

**Verify:** `make alpha_env_validate` with `BOILERPLATE_K8S_OUTPUT_REPO` set.

## Phase 5 — Port sync (deterministic)

**Plan:** [05-port-sync-deterministic.md](05-port-sync-deterministic.md)

- Implement port contract + script(s) + `make` target(s) so container, Service, Ingress, and
  probe ports stay aligned with merged `remote_k8s` env.

**Verify:** New validate target passes; manual spot-check built manifests for one component.

## Phase 6 — Docs and cutover

**Plan:** [06-docs-cutover-staging.md](06-docs-cutover-staging.md)

- Update REMOTE-K8S-GITOPS, INFRA-K8S, K8S-ENV-RENDER; remove misleading `alpha-application.yaml`;
  document canonical Argo in GitOps repo (`ARGOCD-GITOPS-BOILERPLATE.md`).
- Operator cutover checklist: `GITOPS-CUTOVER-STAGING-CHECKLIST.md`.

**Verify:** Doc review; operators run staging checklist on cluster.

## Parallelism

- Phases **1 → 2 → 3** are mostly sequential (3 depends on 2 bases existing on a **pushed**
  branch/tag).
- **4** can overlap **design** with **5** early, but **implementation** of 4 should follow
  once 5’s output shape is known (or implement 5 first if 4 only lists new paths).

## Copy-pasta prompts

Use [COPY-PASTA.md](COPY-PASTA.md) to run one plan per message to an agent.
