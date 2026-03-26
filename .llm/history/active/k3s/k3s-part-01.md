# Feature: k3s (Part 1)

> **Note**: This LLM history file is optional. If you're not using LLM assistance for development, you can delete this file and the containing directory. The history tracking system helps document LLM-assisted decisions but is not required for contributing.
> 
> **10-Session Limit**: Each part file is limited to 10 sessions. When adding Session 11, create `k3s-part-02.md`.

## Metadata
- Started: 2026-03-18
- Completed: In Progress
- Author: Mitch Downey
- LLM(s): Cursor, Claude, etc.
- GitHub Issues: https://github.com/podverse/boilerplate/issues/42
- Branch: feature/k3s
- Origin: https://github.com/podverse/boilerplate.git
- Is Fork: no

## Context

Add a local-first k3d + ArgoCD deployment foundation for Boilerplate, with environment separation
that is ready for non-local secret/version-control integration later.

## Sessions

### Session 1 - 2026-03-18

#### Prompt (Developer)

are plans 37 and 38 completed? if not, continue, if they are move them to completed

#### Key Decisions

- Treat plan 37 as completed because the k3d + ArgoCD foundation has been implemented.
- Treat plan 38 as completed because it is an intentionally future-only placeholder plan and is now
  established.
- Move both plans from active to completed and update plan index/orchestration files accordingly.

#### Files Changed

- .llm/history/active/k3s/k3s-part-01.md
- .llm/plans/completed/boilerplate-k3s/00-EXECUTION-ORDER.md
- .llm/plans/completed/boilerplate-k3s/00-SUMMARY.md
- .llm/plans/completed/boilerplate-k3s/COPY-PASTA.md
- .llm/plans/completed/boilerplate-k3s/37-k3d-argocd-deployment-foundation.md
- .llm/plans/completed/boilerplate-k3s/38-ansible-secrets-repo-integration-placeholder.md
- .llm/plans/active/boilerplate/00-EXECUTION-ORDER.md
- .llm/plans/active/boilerplate/00-SUMMARY.md
- .llm/plans/active/boilerplate/COPY-PASTA.md
- .llm/plans/completed/boilerplate/37-k3d-argocd-deployment-foundation.md
- .llm/plans/completed/boilerplate/38-ansible-secrets-repo-integration-placeholder.md
- .llm/plans/active/boilerplate/00-EXECUTION-ORDER.md
- .llm/plans/active/boilerplate/00-SUMMARY.md
- .llm/plans/active/boilerplate/COPY-PASTA.md

### Session 2 - 2026-03-18

#### Prompt (Developer)

if those are completed their related plan files exec summ copy should be moved as well

#### Key Decisions

- Keep `active/boilerplate` plan meta files in place because other plans are still active.
- Create a dedicated completed plan set for k3s plans 37 and 38 with its own
  `00-EXECUTION-ORDER.md`, `00-SUMMARY.md`, and `COPY-PASTA.md`.
- Move plans 37 and 38 into that dedicated completed set and update active references.

#### Files Changed

- .llm/history/active/k3s/k3s-part-01.md

### Session 3 - 2026-03-18

#### Prompt (Developer)

Fix Argo CD install "annotations too long" (262144 bytes). Implement the plan as specified.

#### Key Decisions

- Use server-side apply when applying the Argo CD install manifest so kubectl does not add the oversized `last-applied-configuration` annotation to the ApplicationSet CRD.
- Add `--force-conflicts` for idempotent re-runs. Document the error and fix in K3D-ARGOCD-LOCAL.md troubleshooting.

#### Files Created/Modified

- scripts/infra/argocd/install.sh
- docs/development/K3D-ARGOCD-LOCAL.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 4 - 2026-03-18

#### Prompt (Developer)

Fix Kustomize stack apply (file not in or below root). Implement the plan as specified.

#### Key Decisions

- Keep all configMapGenerator paths under the kustomization root so Kustomize load restrictor is satisfied. Added init_database.sql and init_management_database.sql under base/stack/postgres-init/ (committed copies). Updated base kustomization to reference postgres-init/init_database.sql and postgres-init/init_management_database.sql.
- Option B for sync: Make target sync_k8s_postgres_init copies canonical SQL into base/stack/postgres-init/; local_k3d_up depends on it. Documented in INFRA-K8S.md.

#### Files Created/Modified

- infra/k8s/base/stack/postgres-init/init_database.sql (new)
- infra/k8s/base/stack/postgres-init/init_management_database.sql (new)
- infra/k8s/base/stack/kustomization.yaml
- makefiles/local/Makefile.local.k3d.mk
- infra/k8s/INFRA-K8S.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 5 - 2026-03-19

#### Prompt (Agent)

k3d API Backend URL Fix — Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- Root cause: `instrumentation.ts` in both web and management-web fetches sidecar config at startup and stores it in `globalThis`. The sidecar serves `http://localhost:4000` (browser-facing) for `NEXT_PUBLIC_API_URL`, causing `getServerUser()` in server components to call `localhost:4000` from inside the pod → ECONNREFUSED. Same pattern broke management-web with `MANAGEMENT_API_BACKEND_URL=http://localhost:4100`.
- Introduced `API_BACKEND_URL` pattern for web (mirroring management-web's `MANAGEMENT_API_BACKEND_URL`): web-sidecar serves it (`http://api:4000`), instrumentation stores it in globalThis, server-auth and proxy read it via `getServerApiBaseUrl()`.
- Added `getServerApiBaseUrl()` to `apps/web/src/config/env.ts` — prefers `API_BACKEND_URL` over `NEXT_PUBLIC_API_URL`, falls back gracefully.
- Added `API_BACKEND_URL=http://api:4000` env override to web deployment in workloads.yaml so Edge middleware (`proxy.ts`) can read it from `process.env` (globalThis is not shared across Edge runtime requests).
- Added `MANAGEMENT_API_BACKEND_URL=http://management-api:4100` env override to management-web deployment for same Edge middleware reason.
- Changed `NEXT_PUBLIC_MANAGEMENT_API_URL` from `/api/management` (relative, requires reverse proxy) to `http://localhost:4100` (absolute, direct k3d port mapping) so browser client calls to management-api work in the k3d local setup.
- Added `NEXT_PUBLIC_AUTH_MODE="admin_only_username"` to web-sidecar.env so the proxy middleware correctly evaluates auth-mode-specific route guards.

#### Files Created/Modified

- infra/config/local/management-web-sidecar.env
- apps/management-web/sidecar/.env.example
- infra/config/local/web-sidecar.env
- apps/web/sidecar/.env.example
- apps/web/sidecar/src/server.ts
- apps/web/src/config/runtime-config.ts
- apps/web/src/config/runtime-config-store.ts
- apps/web/src/config/env.ts
- apps/web/src/lib/server-auth.ts
- apps/web/src/proxy.ts
- infra/k8s/base/stack/workloads.yaml
- .llm/history/active/k3s/k3s-part-01.md

### Session 6 - 2026-03-19

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt after running make local_k3d_up

localhost:4000 4002 4100 4102 all say "connection reset" in the browser. i thought all of those would be accessible locally in my web browser. debug

#### Key Decisions

- Runtime evidence from `kubectl -n boilerplate-local describe pod ...` showed `ImagePullBackOff` for app pods (`api`, `management-api`, `web-sidecar`, `management-web-sidecar`) with `pull access denied` for `docker.io/library/boilerplate-local-*`. This directly explained browser `connection reset` on localhost ports.
- Confirmed only one local app image (`boilerplate-local-management-web:latest`) existed on k3d nodes; the rest were missing. ArgoCD was healthy and not the root cause for endpoint resets.
- Additional runtime evidence from `kubectl describe node ...` showed `NodeHasDiskPressure` and `FreeDiskSpaceFailed` on both k3d nodes. Kubelet image GC was active during startup, which can evict imported app images and trigger downstream `ImagePullBackOff`.
- Updated `scripts/infra/k3d/local-up.sh` to import each local app image individually with retries and per-node verification, then run a final full-set verification pass before creating secrets/deployments. If any image is missing (including post-import eviction), script exits with a clear disk-pressure remediation message.
- Extended troubleshooting docs with explicit `NodeHasDiskPressure` / `FreeDiskSpaceFailed` guidance and remediation.

#### Files Created/Modified

- scripts/infra/k3d/local-up.sh
- docs/development/K3D-ARGOCD-LOCAL.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 7 - 2026-03-20

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt:7-1621 still Internal Server Error. debug.

#### Key Decisions

- Runtime evidence showed `make local_env_setup` regenerated `infra/config/local/web-sidecar.env` with `API_BACKEND_URL="http://localhost:4000"`, which propagated into the `boilerplate-web-sidecar-env` secret and caused web server-side calls to target localhost inside the pod.
- Added Docker-safe default `API_BACKEND_URL="http://boilerplate_local_api:4000"` in web-sidecar env defaults so non-k3d local runs remain correct without localhost self-targeting.
- Added explicit k3d override on `web-sidecar` deployment (`API_BACKEND_URL=http://api:4000`) in `infra/k8s/base/stack/workloads.yaml` so sidecar-served runtime config is always cluster-correct.
- Runtime evidence then surfaced a second issue: web returned 500 with `An error occurred while loading instrumentation hook: fetch failed` (EHOSTUNREACH to web-sidecar service). Added defensive handling in `apps/web/instrumentation.ts` so transient sidecar fetch failure does not hard-fail app startup.
- Kept debug instrumentation logs in place (per debug mode) for one more verification round.

#### Files Created/Modified

- apps/web/sidecar/.env.example
- infra/config/local/web-sidecar.env
- infra/k8s/base/stack/workloads.yaml
- apps/web/sidecar/src/server.ts
- apps/web/src/config/env.ts
- apps/web/instrumentation.ts
- .llm/history/active/k3s/k3s-part-01.md

### Session 8 - 2026-03-20

#### Prompt (Developer)

The issue has been fixed. Please clean up the instrumentation.

#### Key Decisions

- Removed temporary debug instrumentation blocks (`// #region agent log` ... `// #endregion`) from web sidecar/config/runtime instrumentation files now that the issue is confirmed fixed.
- Kept the functional resilience fix in `apps/web/instrumentation.ts` (`try/catch` around sidecar runtime-config fetch) so startup no longer hard-fails on transient sidecar unreachability.

#### Files Created/Modified

- apps/web/sidecar/src/server.ts
- apps/web/src/config/env.ts
- apps/web/instrumentation.ts
- .llm/history/active/k3s/k3s-part-01.md

### Session 9 - 2026-03-25

#### Prompt (Developer)

after running local_k3d_up and it claims it is successful i try to go to localhost 4000 and 4002 and 4100
and 4102 in the browser and none of the pages load. 4000 and 4100 say reset connection. 4002 and 4102 say
internal server error. fix

#### Key Decisions

- Runtime evidence: `api` and `management-api` pods were CrashLoopBackOff; `kubectl logs` showed
  `API_PORT` / `MANAGEMENT_API_PORT` set to Kubernetes service-link values like
  `tcp://10.43.x.x:4000`, failing app startup validation (must be integer).
- Root cause: Services named `api` and `management-api` inject `API_PORT` and `MANAGEMENT_API_PORT`
  env vars into every pod in the namespace; they override the intended listen port semantics.
- Fix: Set explicit `API_PORT: "4000"` and `MANAGEMENT_API_PORT: "4100"` in
  `infra/k8s/base/stack/workloads.yaml` so container env overrides service-link injection.
- Post-fix: curl `http://127.0.0.1:4000/v1/health` and `4100/v1/health` return 200; web ports return
  307 (redirect), not 500.

#### Files Created/Modified

- infra/k8s/base/stack/workloads.yaml
- .llm/history/active/k3s/k3s-part-01.md

### Session 10 - 2026-03-25

#### Prompt (Developer)

@terminals/11.txt (curl empty reply on 4000/4100/4102 after local_k3d_up; web 4002 sometimes works)

#### Key Decisions

- Root cause (in addition to service-link `API_PORT` / `MANAGEMENT_API_PORT`): Argo CD Application
  `boilerplate-local-stack` under `infra/k8s/local/apps` used automated **selfHeal** and synced
  `infra/k8s/local/stack` from **GitHub**, overwriting `local-up.sh`’s final `kubectl apply` so the
  cluster matched remote `feature/k8s-alpha` instead of the working tree (empty curl / crash loops
  until Git had the port fixes).
- Set `enableServiceLinks: false` on all boilerplate-local workload pod specs to avoid Kubernetes
  injecting `*_PORT=tcp://…` env vars that collide with app listen-port variables.
- Moved stack Application CR to `infra/k8s/argocd/boilerplate-local-stack-application.yaml` and
  apply it from `bootstrap.sh`; removed `local/apps/stack.yaml`. Parent `boilerplate-local` now uses
  manual sync only; `local/apps` holds a placeholder ConfigMap so the directory is non-empty for Git.
- Documented behavior in `docs/development/K3D-ARGOCD-LOCAL.md` and `infra/k8s/INFRA-K8S.md`.

#### Files Created/Modified

- infra/k8s/base/stack/workloads.yaml
- infra/k8s/argocd/boilerplate-local-stack-application.yaml
- infra/k8s/local/apps/argocd-placeholder-configmap.yaml
- infra/k8s/local-application.yaml
- infra/k8s/local/apps/stack.yaml (removed)
- scripts/infra/argocd/bootstrap.sh
- scripts/infra/k3d/local-up.sh
- docs/development/K3D-ARGOCD-LOCAL.md
- infra/k8s/INFRA-K8S.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 11 - 2026-03-25

#### Prompt (Developer)

The issue has been fixed. Please clean up the instrumentation.

#### Key Decisions

- Confirmed no Cursor debug instrumentation (e.g. `// #region agent log`, ingest `fetch`, NDJSON
  logging) was added during the k3d port / Argo CD fixes; only Kubernetes manifests and scripts
  changed. No source files required cleanup.
- Kept intentional YAML comments on `API_PORT` / `MANAGEMENT_API_PORT` and `enableServiceLinks` as
  operational documentation, not temporary debug code.

#### Files Created/Modified

- .llm/history/active/k3s/k3s-part-01.md

### Session 12 - 2026-03-25

#### Prompt (Developer)

i don't understand the yaml and sh changes that you just made and why they are necessary. create a new
thorough markdown file that can help me understand, and include diagrams so i can visualize the
processes. i want to ensure the changes you made are the most efficient and graceful way we can
handle this

#### Key Decisions

- Added a thorough k3d/Argo rationale doc under `docs/development/` (since removed; see Session 14) with Mermaid
  diagrams, problem/solution split (service links vs Argo self-heal), alternatives table, file checklist, and glossary.
- Linked that doc from `docs/development/K3D-ARGOCD-LOCAL.md` and `infra/k8s/INFRA-K8S.md` (links removed in Session 14).

#### Files Created/Modified

- docs/development/K3D-ARGOCD-LOCAL.md
- infra/k8s/INFRA-K8S.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 13 - 2026-03-25

#### Prompt (Developer)

Clarify repoURL / targetRevision for local Argo Applications

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Kept `repoURL` and `targetRevision` (required for Git-backed Argo CD Sync and comparison); clarified
  in YAML comments that `kubectl apply` during `make local_k3d_up` does not use those fields.
- Re-added the k3d/Argo rationale doc under `docs/development/` with Argo section, cross-reference to inline YAML
  comments, and a short Mermaid flowchart; linked from `K3D-ARGOCD-LOCAL.md` and `INFRA-K8S.md` (doc and links removed
  in Session 14).

#### Files Created/Modified

- infra/k8s/local-application.yaml
- infra/k8s/argocd/boilerplate-local-stack-application.yaml
- docs/development/K3D-ARGOCD-LOCAL.md
- infra/k8s/INFRA-K8S.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 14 - 2026-03-25

#### Prompt (Developer)

K3D-LOCAL-KUBERNETES-ARGO-RATIONALE.md you can remove all references to this and the file itself

#### Key Decisions

- Deleted the standalone k3d/Argo rationale markdown under `docs/development/` and removed links from
  `K3D-ARGOCD-LOCAL.md` and `INFRA-K8S.md`.
- Adjusted Sessions 12–13 history bullets so they no longer list the removed doc path; troubleshooting in
  `K3D-ARGOCD-LOCAL.md` still covers `kubectl apply` vs manual Argo Sync.

#### Files Created/Modified

- docs/development/K3D-ARGOCD-LOCAL.md
- infra/k8s/INFRA-K8S.md
- .llm/history/active/k3s/k3s-part-01.md

### Session 15 - 2026-03-26

#### Prompt (Developer)

localhost:4002 worked, but localhost:4102 says internal server error. why? @/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/11.txt:593-960

#### Key Decisions

- Confirmed via `kubectl logs deploy/management-web`: `fetch failed` / `getaddrinfo ENOTFOUND boilerplate_local_management_api` — proxy `trySessionRestore` calls `getServerManagementApiBaseUrl()`, which read `MANAGEMENT_API_SERVER_BASE_URL` from `getRuntimeConfig()` after the root layout overwrote the global with sidecar JSON still using Docker Compose hostnames from `infra/config/local/management-web-sidecar.env`; the Deployment’s `MANAGEMENT_API_SERVER_BASE_URL=http://management-api:4100` was ignored.
- Prefer `process.env.MANAGEMENT_API_SERVER_BASE_URL` (and `API_SERVER_BASE_URL` for main web) before runtime-config in `getServerManagementApiBaseUrl` / `getServerApiBaseUrl` so k8s-injected in-cluster DNS always wins.

#### Files Created/Modified

- apps/management-web/src/config/env.ts
- apps/web/src/config/env.ts
- .llm/history/active/k3s/k3s-part-01.md

### Session 16 - 2026-03-26

#### Prompt (Developer)

The issue has been fixed. Please clean up the instrumentation.

#### Key Decisions

- Verified there is no temporary debug instrumentation in the codebase (no ingest `fetch`, `#region agent log`, or NDJSON hooks were added during the k3d management-web investigation; evidence used `kubectl logs`).
- Left the production fix in place: `getServerManagementApiBaseUrl` / `getServerApiBaseUrl` prefer `process.env` for server API base URLs when set.

#### Files Created/Modified

- .llm/history/active/k3s/k3s-part-01.md

---

## Related Resources

- [Link to PR]
- [Link to related issues]
