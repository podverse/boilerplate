# 05 — Port sync (deterministic)

**Status:** Completed 2026-03-27 — contract `infra/k8s/remote/port-contract.yaml`, generator
`scripts/k8s-env/render_remote_k8s_ports.rb`, Makefile targets, integrated into `alpha_env_render`
and `validate-k8s-env-drift.sh`; GitOps alpha wired with patches + generated files.

## Problem

Application listen ports and dependent URLs appear in multiple places:

- Deployment: `containerPort`, `readinessProbe` / `livenessProbe` `httpGet.port`
- Service: `port`, `targetPort`
- Ingress: `service.port.number` (where applicable)
- Env literals: e.g. `RUNTIME_CONFIG_URL`, `http://api:4000` in web sidecar
- Classification: `API_PORT`, `WEB_PORT`, `WEB_SIDECAR_PORT`, `MANAGEMENT_*_PORT` in
  [`infra/env/classification/base.yaml`](../../../../infra/env/classification/base.yaml)

Drift causes subtle outages (probe wrong port, ingress to wrong Service port).

## Goal

One **deterministic** pipeline: inputs → generated patches or validated manifests. Prefer
**same merged env** as `remote_k8s` render (`dev/env-overrides/<env>/*.env` + classification)
so ports in cluster match what apps believe.

## Recommended approach

1. **Port contract** — Small YAML in Boilerplate, e.g. `infra/k8s/remote/port-contract.yaml`,
   listing logical keys:

   - `api_container`, `web_container`, `web_sidecar_container`, `management_api_container`, …
   - Optional: `postgres_cluster`, `valkey_cluster` (defaults 5432 / 6379) for initContainer checks

2. **Generator script** (Ruby recommended for YAML safety, consistent with `render_k8s_env.rb`):

   - Read merged env for `K8S_ENV` (reuse existing merge helper or shell out to
     `merge-env`-equivalent).
   - Validate required port keys exist and are numeric.
   - Emit **strategic-merge patch** files per component, e.g.
     `deployment-ports-and-probes.yaml`, **or** one patch per deployment. Files must be listed
   in overlay `patchesStrategicMerge` **after** base resources.

3. **URL-shaped env** — Derive `http://api:<port>` and similar from contract + Kubernetes
   Service DNS names (`api`, `management-api`, etc.) so changing `API_PORT` updates both numeric
   and URL env literals in generated patches **or** in render (if those keys are classified as
   `config` — coordinate with 04). **Public** HTTPS base URLs (CORS, cookies, browser-facing
   config) still come from `alpha` overrides / rendered ConfigMaps and must use the
   **metaboost.cc** alpha host set (see [00-SUMMARY.md](00-SUMMARY.md)); port tooling does not
   fix domain drift.

4. **Ingress** — If ingress backend ports reference Service `port` numbers that mirror
   container ports, generate a small patch under `apps/boilerplate-alpha/common/` **or**
   document that Ingress always targets **named** Service ports and only Service YAML is
   patched (simpler).

## Make targets

- `make k8s_remote_ports_render` — write patches into `BOILERPLATE_K8S_OUTPUT_REPO` (same var as
  env render) or a dedicated `BOILERPLATE_K8S_OUTPUT_REPO` path documented as shared.
- `make k8s_remote_ports_validate` — temp render + diff against committed patches (mirror
  `validate-k8s-env-drift.sh` pattern).

Optionally fold into `alpha_env_render` as a final step so one command refreshes env + ports.

## Steps

1. Enumerate every YAML path that contains a port number (from plan **01** table).
2. Implement contract schema + script + tests (if Ruby: minimal test or shell golden file).
3. Wire Makefile + document in K8S-ENV-RENDER / REMOTE-K8S-GITOPS.
4. Run once against alpha; commit generated patches; verify cluster.

## Verification

- Change `API_PORT` in alpha overrides only; rerun generator; `git diff` shows all expected
  locations updated.
- `kubectl kustomize apps/boilerplate-alpha/api` shows probes and containerPort matching
  Service `targetPort`.

## Dependencies

- Plan **01** port inventory.
- Plan **02**/**03** stable enough to know patch targets (Deployment names).

## Open choice

Record in `00-SUMMARY.md`: **strategic merge patches** vs **Kustomize replacements** (newer
kubectl). Prefer whichever the team can lint and drift-check easily.
