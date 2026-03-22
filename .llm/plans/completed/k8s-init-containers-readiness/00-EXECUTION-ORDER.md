# K8s init containers and readiness – Execution Order

Run phases sequentially. Within a phase, run plan files in order unless marked parallel.

## Plan file location

All plans: `.llm/plans/active/k8s-init-containers-readiness/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, dependency map, decisions |
| [01-init-containers-api-management-api.md](01-init-containers-api-management-api.md) | Init containers on api and management-api (wait for postgres and valkey) |
| [02-init-containers-web-readiness-probes.md](02-init-containers-web-readiness-probes.md) | Init containers on web/management-web (wait for sidecars); readiness probes on app deployments |
| [COPY-PASTA.md](COPY-PASTA.md) | Copy-paste prompts for implementation |

## Phase 1: API and management-api startup order

1. **01-init-containers-api-management-api** – Add init containers to the api and management-api deployments so their main containers only start after postgres and valkey are accepting connections. Reduces or eliminates CrashLoopBackOff on first cluster bring-up.

## Phase 2: Web startup order and readiness

2. **02-init-containers-web-readiness-probes** – Add init containers to web and management-web that wait for their sidecar (e.g. HTTP reachable). Add readiness (and optionally liveness) probes to api, management-api, web, and management-web so Services only send traffic to ready pods.

## Rules

- Phases are sequential; do not start Phase N+1 until Phase N is complete.
- Execute each plan when the user pastes the corresponding prompt from COPY-PASTA.md.

## Completed

Both phases implemented. Plan set archived to `.llm/plans/completed/k8s-init-containers-readiness/`.
