# K8s init containers and readiness – Summary

## Scope

- **Where:** Local k3d stack only; manifests in [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml).
- **What:** Ensure dependent pods do not start until their dependencies are ready, and that traffic is only sent to ready pods.
- **Why:** Today api and management-api start immediately and crash until postgres (and valkey) are ready; web and management-web can return 500 if sidecars or APIs are not ready. Init containers enforce startup order; readiness probes prevent the load balancer from sending traffic to not-ready pods.

## Implementation status (completed)

- **01** and **02** implemented. Api and management-api: init containers (busybox) + readiness/liveness on `/health`. Web and management-web: init containers (alpine, wget) waiting for sidecar HTTP + readiness/liveness on `/`. Postgres already had probes; valkey has no probes (unchanged; optional follow-up if needed).

## Plan files

| ID | File | Description |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Phase order |
| – | 00-SUMMARY.md | This file |
| 01 | 01-init-containers-api-management-api.md | Init containers on api and management-api (wait for postgres, valkey) |
| 02 | 02-init-containers-web-readiness-probes.md | Init on web/management-web (wait for sidecar); readiness probes on all app deployments |

## Dependency map

- **01** – No plan dependencies. Depends on existing postgres and valkey services (same namespace).
- **02** – Depends on 01 (optional but logical: stabilize APIs first, then web + probes).

## Key decisions

- **Wait mechanism:** Use init containers with a minimal image (e.g. busybox or alpine) and a loop that checks TCP connectivity (`nc -z host port`) or HTTP (e.g. sidecar config endpoint) until success. Avoid adding new custom images if possible; use widely available images.
- **Postgres readiness:** Init waits for TCP 5432 on the postgres service (or use `pg_isready` in an init if we use the postgres image and pass env). Prefer generic TCP check so we don’t depend on postgres env in the init.
- **Valkey readiness:** Init waits for TCP 6379 on the valkey service.
- **Sidecar readiness:** Web and management-web init containers wait for the sidecar’s HTTP endpoint (e.g. `http://web-sidecar:4001/` or a known path) to return success before the main container starts.
- **Readiness probes:** Add HTTP readiness probes to api (e.g. `/health` or `/`), management-api, web, and management-web so the Service only forwards to pods that report ready. Use the same endpoint as liveness if the app exposes one, or a lightweight health route.
- **Namespace:** All resources are in namespace `boilerplate-local`; init containers use the same service DNS (postgres, valkey, web-sidecar, management-web-sidecar).
