# K8s init containers and readiness – Copy-Pasta

Use these prompts one at a time, in order. Wait for each to complete before running the next.

---

## Phase 1: Init containers for api and management-api

**Prompt 1:** Read and execute `.llm/plans/active/k8s-init-containers-readiness/01-init-containers-api-management-api.md`. Add init containers to the api and management-api deployments in `infra/k8s/base/stack/workloads.yaml` so they wait for postgres and valkey before the main container starts. Use a minimal image (e.g. busybox) and TCP checks (`nc -z`). Verify with `kubectl -n boilerplate-local get pods` and optionally `make local_k3d_down` then `make local_k3d_up`.

---

## Phase 2: Init containers for web/management-web and readiness probes

**Prompt 2:** Read and execute `.llm/plans/active/k8s-init-containers-readiness/02-init-containers-web-readiness-probes.md`. Add init containers to the web and management-web deployments (wait for sidecar HTTP), and add readiness probes (and optionally liveness) to api, management-api, web, and management-web in `infra/k8s/base/stack/workloads.yaml`. Verify pods become Ready and browser can load localhost:4002 and localhost:4102.
