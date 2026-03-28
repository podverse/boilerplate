# 01 — Inventory and target layout

## Scope

Establish an authoritative map from **current** `k.podcastdj.com/apps/boilerplate-alpha/*` to
**future** layout: reusable **bases** in Boilerplate vs **environment-specific** overlays in
GitOps. Choose **local k3d** refactor scope so later phases do not thrash.

## Domains (inventory must capture this explicitly)

Manifests are stored in the **k.podcastdj.com** repo, but **alpha** is served on
**metaboost.cc** (alpha) hostnames on the **same** cluster. The inventory table should include a
column or appendix listing:

- Every **Ingress** host and TLS reference under `apps/boilerplate-alpha/common/`.
- Every **classification-driven** URL or domain key that must match those hosts after render
  (e.g. API CORS origins, web/management base URLs, cookie domain, runtime config).

Mismatches between ingress and rendered env are a common source of 401/CORS/cookie bugs; treat
**metaboost.cc** as the source of truth for **external** URLs, not the GitOps repo hostname.

## Current inventory (reference paths)

GitOps repo paths (typical):

- `apps/boilerplate-alpha/common/` — namespace, ingress
- `apps/boilerplate-alpha/api/` — deployment, service, kustomization, rendered configmap +
  `deployment-secret-env.yaml`
- `apps/boilerplate-alpha/web/` — web + web-sidecar deployments/services
- `apps/boilerplate-alpha/management-api/`, `management-web/` — same pattern
- `apps/boilerplate-alpha/db/`, `keyvaldb/` — stateful data tiers
- `argocd/boilerplate-alpha/*.yaml` — Argo `Application` per component

Boilerplate repo today:

- `infra/k8s/base/stack/` — **monolithic** local-oriented workloads (`workloads.yaml`, etc.)
- `infra/k8s/local/` — k3d overlay
- `infra/k8s/alpha/` — docs only; `alpha-application.yaml` points at non-existent
  `infra/k8s/alpha/apps`
- `scripts/k8s-env/*` — render to `apps/boilerplate-<env>/` under `BOILERPLATE_K8S_OUTPUT_REPO`

## Target layout

### Boilerplate `infra/k8s/base/` (new or expanded)

Per component, Podverse-like structure (numbered files optional but preferred for consistency):

- `api/` — configmap template or minimal stub, service, deployment
- `web/` — deployment-web, deployment-web-sidecar, service-web, service-web-sidecar (or
  subfolders if cleaner)
- `management-api/`, `management-web/` — mirror web pattern
- `db/`, `keyvaldb/` — align naming with GitOps folder `keyvaldb`

Bases contain **no** environment hostnames, **no** alpha image tags, **no** merged secrets.
They **do** contain stable image **repository** names (for `kustomize images:` replacement),
container names, probes paths, and **placeholder** ports **or** ports driven only by patches
(see plan 05).

### GitOps `apps/boilerplate-alpha/<component>/` (thin)

Each `kustomization.yaml`:

- `resources:` — remote URL to `github.com/<org>/boilerplate/infra/k8s/base/<component>?ref=…`
- `namespace`, `labels`, `images` (tags), `patchesStrategicMerge` for generated secrets + any
  port patches
- **Retained** generated files from `make alpha_env_render`: `configmap*.yaml`,
  `deployment-secret-env.yaml` (unless moved to generator-only naming—decide in 04)

### Argo CD

Keep **per-component** Applications under `argocd/boilerplate-alpha/`; only update if paths or
repo URLs change. Confirm `repoURL` / `targetRevision` for GitOps repo remain correct.

## Steps

1. **Spreadsheet or table** (in this plan file or linked doc): one row per file under
   `apps/boilerplate-alpha`, column for “moves to base”, “stays overlay”, “deleted after
   remote base”, “generated only”.
2. **List port-bearing fields** per component (containerPort, service targetPort, ingress
   backend port, probe port, env literals like `http://api:4000`) for plan 05.
3. **List domain-bearing fields** (ingress hosts, rendered config keys) and confirm they use
   **metaboost.cc** alpha URLs consistently (see section above).
4. **Decision — local k3d:**
   - **Option A (preferred long-term):** Refactor `infra/k8s/local/stack` to compose same
     `infra/k8s/base/*` pieces + local patches (PVC, nodeport, etc.).
   - **Option B:** Leave local stack as-is until remote stabilizes; document technical debt in
     `00-SUMMARY.md`.
5. Record the chosen option in [00-SUMMARY.md](00-SUMMARY.md) decisions table.

## Verification

- Completed inventory table checked against `git ls-files apps/boilerplate-alpha` in GitOps
  clone.
- `00-SUMMARY.md` updated with local k3d decision.

## Key files to inspect

- GitOps clone: `apps/boilerplate-alpha/` (repository and path names may vary)
- Boilerplate: `infra/k8s/base/stack/`
- Boilerplate: `scripts/k8s-env/k8s-env-render-manifest.inc.sh`

## Phase 1 deliverable (completed 2026-03-27)

Inventory generated from workspace clone of **k.podcastdj.com** `apps/boilerplate-alpha/`
(28 tracked paths). **Note:** Several `kustomization.yaml` files list `configmap*.yaml` and
`deployment-secret-env.yaml` that are **not** present in the tree here—they are expected from
`make alpha_env_render` (or manual emit) before `kubectl kustomize` succeeds.

### Table A — File disposition (per path)

| Path                                           | Disposition   | Target base dir (plan 02) | Overlay retains                         |
| ---------------------------------------------- | ------------- | ------------------------- | --------------------------------------- |
| `common/00-namespace.yaml`                     | Overlay only  | —                         | Namespace manifest                      |
| `common/ingress.yaml`                          | Overlay only  | —                         | metaboost.cc hosts, TLS, annotations    |
| `common/kustomization.yaml`                    | Overlay only  | —                         | resources list, labels                  |
| `api/deployment.yaml`                          | Move to base  | `base/api/`               | `images`, patches, extra env            |
| `api/service.yaml`                             | Move to base  | `base/api/`               | —                                       |
| `api/kustomization.yaml`                       | Overlay only  | —                         | remote `resources`, generated files     |
| `api/configmap.yaml`                           | Generated     | —                         | Render output (often not in git)        |
| `api/deployment-secret-env.yaml`             | Generated     | —                         | Render output                           |
| `web/deployment-web.yaml`                      | Move to base  | `base/web/`               | `images`, patches                       |
| `web/deployment-web-sidecar.yaml`            | Move to base  | `base/web/`               | `images`, patches                       |
| `web/service-web.yaml`                         | Move to base  | `base/web/`               | —                                       |
| `web/service-web-sidecar.yaml`                 | Move to base  | `base/web/`               | —                                       |
| `web/kustomization.yaml`                       | Overlay only  | —                         | remote `resources`, sidecar CM, secrets |
| `web/configmap-web-sidecar.yaml`             | Generated     | —                         | Render output                           |
| `web/deployment-secret-env.yaml`             | Generated     | —                         | If added per render manifest            |
| `management-api/deployment.yaml`               | Move to base  | `base/management-api/`    | `images`, patches                       |
| `management-api/service.yaml`                | Move to base  | `base/management-api/`    | —                                       |
| `management-api/kustomization.yaml`          | Overlay only  | —                         | remote `resources`, generated           |
| `management-api/configmap.yaml`              | Generated     | —                         | Render output                           |
| `management-api/deployment-secret-env.yaml`  | Generated     | —                         | Render output                           |
| `management-web/deployment-management-web.yaml`       | Move to base | `base/management-web/` | `images`, patches                |
| `management-web/deployment-management-web-sidecar.yaml` | Move to base | `base/management-web/` | `images`, patches            |
| `management-web/service-management-web.yaml`   | Move to base  | `base/management-web/`    | —                                       |
| `management-web/service-management-web-sidecar.yaml` | Move to base | `base/management-web/` | —                                       |
| `management-web/kustomization.yaml`            | Overlay only  | —                         | remote `resources`, sidecar CM          |
| `management-web/configmap-management-web-sidecar.yaml` | Generated | —                    | Render output                           |
| `db/deployment-postgres.yaml`                  | Move to base  | `base/db/`                | `images`, PVC, limits                  |
| `db/service-postgres.yaml`                     | Move to base  | `base/db/`                | —                                       |
| `db/pvc-postgres.yaml`                         | Move to base  | `base/db/`                | Or overlay-only if env-specific size    |
| `db/kustomization.yaml`                        | Overlay only  | —                         | remote `resources`, generated db CM/secret |
| `keyvaldb/deployment-valkey.yaml`              | Move to base  | `base/keyvaldb/`          | `images`, patches                       |
| `keyvaldb/service-valkey.yaml`                 | Move to base  | `base/keyvaldb/`          | —                                       |
| `keyvaldb/pvc-valkey.yaml`                     | Move to base  | `base/keyvaldb/`          | Or overlay-only if env-specific         |
| `keyvaldb/kustomization.yaml`                  | Overlay only  | —                         | remote `resources`, generated           |
| `scripts/ops/reset-alpha-db.sh`                | Overlay only  | —                         | GitOps ops script; not part of kustomize build |

**Argo:** `argocd/boilerplate-alpha/*.yaml` — overlay only (paths unchanged unless renamed).

### Table B — Port-bearing fields (for plan 05)

| Location                         | Fields / literals                                              |
| -------------------------------- | -------------------------------------------------------------- |
| `common/ingress.yaml`            | Backend `port.number`: 4000, 4002, 4100, 4102                  |
| `api/deployment.yaml`            | `containerPort` 4000; probes `port` 4000; `DB_PORT` `5432`;
  `VALKEY_PORT` `6379`                                             |
| `web/deployment-web.yaml`        | `containerPort` 4002; probes `tcpSocket.port` 4002;
  `RUNTIME_CONFIG_URL` `http://web-sidecar:4001`; `API_BACKEND_URL` `http://api:4000`;
  init wait `web-sidecar:4001`                                            |
| `web/deployment-web-sidecar.yaml`| `containerPort` 4001; `API_BACKEND_URL` `http://api:4000`      |
| `web/service-*.yaml`             | `port` / `targetPort` 4002, 4001                               |
| `management-api/deployment.yaml` | `containerPort` 4100; probes; DB/Valkey ports same pattern    |
| `management-web/deployment-*.yaml` | `containerPort` 4102 / 4101                                  |
| `db/service-postgres.yaml`       | 5432                                                           |
| `keyvaldb/service-valkey.yaml`   | 6379                                                           |

### Table C — Domain-bearing (metaboost.cc) vs classification

**Ingress (committed `common/ingress.yaml`):**

| Host                             | Backend Service   | Service port |
| -------------------------------- | ----------------- | ------------ |
| `api.alpha.metaboost.cc`         | `api`             | 4000         |
| `alpha.metaboost.cc`             | `web`             | 4002         |
| `management-api.alpha.metaboost.cc` | `management-api` | 4100      |
| `management.alpha.metaboost.cc`  | `management-web`  | 4102         |

TLS: `boilerplate-alpha-tls`; hosts list matches the four hosts above. ClusterIssuer currently
`letsencrypt-staging` (TODO prod in file).

**Classification keys** (`infra/env/classification/base.yaml`) that must align with HTTPS URLs
and cookies for alpha (via `dev/env-overrides/alpha/*.env` + render)—non-exhaustive but
critical:

| Env group / area | Keys (must reference metaboost.cc alpha hosts when rendered)        |
| ---------------- | --------------------------------------------------------------------- |
| `http.api`       | `API_PUBLIC_BASE_URL`, `API_SERVER_BASE_URL`                          |
| `http.web`       | `WEB_BASE_URL`                                                        |
| `http.management-api` | `MANAGEMENT_API_PUBLIC_BASE_URL`, `MANAGEMENT_API_SERVER_BASE_URL` |
| `http.management-web` | `MANAGEMENT_WEB_BASE_URL`                                       |
| `api.vars`       | `API_CORS_ORIGINS`, `API_COOKIE_DOMAIN`                               |
| `management-api.vars` | `MANAGEMENT_API_CORS_ORIGINS`                                    |
| `web` / `management-web` (public) | `NEXT_PUBLIC_*` URL mirrors of the above (`NEXT_PUBLIC_API_PUBLIC_BASE_URL`, etc.) |

**Hand-maintained deployment env** that embed cluster DNS + port (not public domain but must
stay in sync with **API** listen port / Service): `API_BACKEND_URL` / similar
`http://api:4000` in web sidecars—plan **05** covers numeric sync.

### Local k3d decision

Recorded in [00-SUMMARY.md](00-SUMMARY.md) **Decisions log**: **Option B** (defer local stack
refactor) until after plans **02–03** stabilize remote bases.
