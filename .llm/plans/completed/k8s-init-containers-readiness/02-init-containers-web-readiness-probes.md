# Plan 02: Init containers for web/management-web and readiness probes

## Scope

1. Add **init containers** to the **web** and **management-web** deployments so their main containers do not start until the corresponding sidecar (web-sidecar, management-web-sidecar) is reachable via HTTP. This avoids the Next.js apps starting and returning 500 when the runtime config URL is not yet available.
2. Add **readiness probes** (and optionally liveness probes) to the **api**, **management-api**, **web**, and **management-web** deployments so the Kubernetes Service only sends traffic to pods that report ready. Existing postgres and valkey already have probes; this extends the pattern to the app deployments.

**Out of scope:** Changing sidecar or postgres/valkey deployments; changing application code (only k8s manifest changes). If the apps do not expose a health endpoint, readiness can use the root path or a simple GET that returns 2xx.

## Steps

### Part A: Init containers for web and management-web

1. **Determine sidecar health check**
   - Web depends on `RUNTIME_CONFIG_URL=http://web-sidecar:4001`. Management-web depends on `http://management-web-sidecar:4101`. The init container must wait until that URL (or a known path on it) returns HTTP 2xx. Check whether the sidecar serves a root path or `/health`; if unknown, use `wget -q --spider` or `curl -sf` on the base URL.

2. **Add init container to web deployment**
   - In [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml), under the **web** Deployment’s `spec.template.spec`, add `initContainers` (before `containers`).
   - Use a small image that has `wget` or `curl` (e.g. `alpine:3.19` or `curlimages/curl`). Example with wget:
     - name: `wait-web-sidecar`
     - image: `alpine:3.19`
     - command: `['sh', '-c', 'until wget -q -O /dev/null http://web-sidecar:4001/ || true; do echo waiting for web-sidecar; sleep 2; done; echo web-sidecar ready']`
   - Adjust the URL path if the sidecar exposes a specific health path (e.g. `/health`). Ensure the command exits 0 only when the sidecar responds.

3. **Add init container to management-web deployment**
   - Same pattern for **management-web**: add init container `wait-management-web-sidecar` that waits for `http://management-web-sidecar:4101/` (or the appropriate path) before the main container starts.

### Part B: Readiness probes for api, management-api, web, management-web

4. **Research health endpoints**
   - Check whether apps/api and apps/management-api expose a health or readiness route (e.g. `GET /health`, `GET /ready`, or `GET /`). If they do, use that for readinessProbe. If not, use `GET /` and accept that any 2xx is “ready,” or document that a health route should be added in a follow-up.
   - For web and management-web (Next.js), readiness can use `httpGet` on `path: /` and `port: 4002` / `4102`; the first request might be slow (server startup), so set `initialDelaySeconds` high enough (e.g. 15–30) and `periodSeconds` (e.g. 10).

5. **Add readinessProbe to api deployment**
   - Under the api container in [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml), add:
     - `readinessProbe`: `httpGet` on `path: /` or `/health`, `port: 4000`; `initialDelaySeconds`: e.g. 5; `periodSeconds`: e.g. 10. Use the same for `livenessProbe` if the app supports it, or omit liveness for now.

6. **Add readinessProbe to management-api deployment**
   - Same for management-api container: `httpGet` on port 4100, path `/` or `/health`, with sensible `initialDelaySeconds` and `periodSeconds`.

7. **Add readinessProbe to web and management-web deployments**
   - For the web container: `httpGet` on `path: /`, `port: 4002`; `initialDelaySeconds` large enough for Next.js to start (e.g. 20–30); `periodSeconds`: 10.
   - For the management-web container: same on port 4102.

## Key files

- [infra/k8s/base/stack/workloads.yaml](infra/k8s/base/stack/workloads.yaml) – Only file to edit. Add `initContainers` to web and management-web; add `readinessProbe` (and optionally `livenessProbe`) to api, management-api, web, and management-web container specs.

## Verification

- After applying: `kubectl -n boilerplate-local get pods` and confirm web and management-web pods only reach Running after their init container succeeds; confirm no pod receives Service traffic until readiness probe succeeds (observe endpoints: `kubectl -n boilerplate-local get endpoints`).
- Open http://localhost:4002 and http://localhost:4102 and confirm they respond without 500 once pods are Ready.
- Optional: `make local_k3d_down` then `make local_k3d_up` and confirm all app pods eventually become Ready and the browser can load the pages without connection reset or internal server error.

## Notes

- If the api or management-api does not expose a dedicated health route, using `GET /` for readiness is acceptable; ensure the root path returns 2xx when the app and DB are healthy. If it returns 4xx/5xx when DB is down, the probe will fail and the pod will be taken out of Service endpoints, which is desired.
- Init container for web/management-web: if the sidecar has no HTTP endpoint, fall back to TCP check on 4001/4101 (e.g. `nc -z web-sidecar 4001`) using the same pattern as plan 01.
- **Implementation:** The init command must exit 0 only when the HTTP check succeeds. Do not use `|| true` in the `until` loop (that would make the loop exit even on wget failure). Use: `until wget -q -O /dev/null http://web-sidecar:4001/; do ... done`.
