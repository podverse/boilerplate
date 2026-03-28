# COPY-PASTA — boilerplate-k8s-gitops-alignment

Paste **one** block per agent session. Run phases in order per
[00-EXECUTION-ORDER.md](00-EXECUTION-ORDER.md). Do not skip verification steps in each plan.

---

## Phase 1 — Inventory

**Status:** Completed 2026-03-27 (tables under **Phase 1 deliverable** in plan 01; k3d **Option B**
in `00-SUMMARY.md`). Re-run only if GitOps paths change materially.

Implement the plan in the Boilerplate repo:

`.llm/plans/completed/boilerplate-k8s-gitops-alignment/01-inventory-and-target-layout.md`

Deliverable: completed inventory table (including **metaboost.cc** domain-bearing fields per
plan **01**) + local k3d decision recorded in `00-SUMMARY.md`. Do not change application code
unless the plan explicitly says to.

---

## Phase 2 — Bases

**Status:** Completed 2026-03-27 — `infra/k8s/base/{api,web,management-api,management-web,db,keyvaldb}/`
added; `kubectl kustomize … --load-restrictor LoadRestrictionsNone` passes each. **Push** a branch
or tag for plan **03** remote URLs.

Implement the plan in the Boilerplate repo:

`.llm/plans/completed/boilerplate-k8s-gitops-alignment/02-boilerplate-base-kustomize.md`

Deliverable: `infra/k8s/base/*` kustomizations build with `kubectl kustomize` (LoadRestrictionsNone
if needed). Push a branch for GitOps to reference.

---

## Phase 3 — GitOps thin overlays

**Status:** In progress 2026-03-27 — k.podcastdj.com overlays use **HTTPS** remote bases
(`https://github.com/...//infra/k8s/base/...?ref=develop` for **podverse/boilerplate**); **ingress**
already uses **metaboost.cc** alpha hosts. **`kubectl kustomize` per component** succeeds when
that **`ref`** contains `infra/k8s/base/<component>/` (plan **02** pushed to that branch); remote
`ref=main` was wrong for podverse because **`main` lags `develop`** (missing current `infra/k8s`).

Implement the plan in the **k.podcastdj.com** (or your GitOps) repo:

Follow `.llm/plans/completed/boilerplate-k8s-gitops-alignment/03-kpodcastdj-thin-overlays.md` — use
the Boilerplate plan file from a clone of the Boilerplate monorepo as the spec.

Deliverable: overlays use remote `resources:` to Boilerplate bases; `kubectl kustomize` per app
path succeeds; **ingress** uses **metaboost.cc** (alpha) hosts consistent with
`00-SUMMARY.md` / plan **03**.

---

## Phase 4 — Render / drift extensions

**Status:** Completed 2026-03-27 — manifest extended with plan-**05** port-patch hooks (empty workload
list); drift + prune wired; **K8S-ENV-RENDER.md** documents thin overlays + **metaboost.cc**;
`make alpha_env_validate` OK vs k.podcastdj.com clone.

Implement the plan in the Boilerplate repo:

`.llm/plans/completed/boilerplate-k8s-gitops-alignment/04-classification-render-and-owned-files.md`

Deliverable: manifest + validate scripts updated; `make alpha_env_validate` passes against
GitOps clone.

---

## Phase 5 — Port sync

**Status:** Completed 2026-03-27 — see plan **05** and [K8S-ENV-RENDER.md](../../../../docs/development/K8S-ENV-RENDER.md)
§ Port sync; k.podcastdj.com alpha kustomizations list port + ingress patches.

Implement the plan in the Boilerplate repo:

`.llm/plans/completed/boilerplate-k8s-gitops-alignment/05-port-sync-deterministic.md`

Deliverable: contract + generator + make targets; GitOps repo receives generated patches;
validate target passes.

---

## Phase 6 — Docs and cutover

**Status:** Completed 2026-03-27 — **REMOTE-K8S-GITOPS** (domain story, publish order, `LoadRestrictionsNone` on overlay kustomize); **INFRA-K8S** (`base/*` vs `base/stack`, Option B); **K8S-ENV-RENDER** cross-links; **ARGOCD-GITOPS-BOILERPLATE** + **GITOPS-CUTOVER-STAGING-CHECKLIST**; removed misleading **`infra/k8s/alpha-application.yaml`**; plan set moved to **completed/**.

Implement the plan in the Boilerplate repo (and GitOps repo if ingress/common patches):

`.llm/plans/completed/boilerplate-k8s-gitops-alignment/06-docs-cutover-staging.md`

Deliverable: docs updated; canonical Argo story (GitOps repo only); operator staging checklist in
**[GITOPS-CUTOVER-STAGING-CHECKLIST.md](../../../../docs/development/GITOPS-CUTOVER-STAGING-CHECKLIST.md)**
— run on staging by your team (not automated here).

---

## Full set index

- [00-EXECUTION-ORDER.md](00-EXECUTION-ORDER.md)
- [00-SUMMARY.md](00-SUMMARY.md)
