### Session 1 - 2026-03-30
#### Prompt (Developer)
make those updates, and also, look for other things you can predict will go wrong like @k.podcastdj.com/apps/boilerplate-alpha/management-web/configmap-management-web-sidecar.yaml:17 and any other issues across web or management-web you can anticipate

#### Key Decisions
- Renamed K8s env keys to match Next.js: `API_SERVER_BASE_URL` and `MANAGEMENT_API_SERVER_BASE_URL` (replacing unused `*_BACKEND_*` names) in `render_remote_k8s_ports.rb` and base Deployments.
- Extended `infra/env/overrides/remote-k8s.yaml` with in-cluster defaults for those URLs so `alpha_env_render` emits sidecar ConfigMaps with Service DNS, not localhost.
- Fixed GitOps `configmap-management-web-sidecar.yaml` `API_SERVER_BASE_URL` (management UI server-side calls to main API).
- Documented port-sync bullet in `K8S-ENV-RENDER.md` to name the correct env vars.

#### Files Created/Modified
- boilerplate/scripts/k8s-env/render_remote_k8s_ports.rb
- boilerplate/infra/k8s/base/web/04-deployment-web.yaml
- boilerplate/infra/k8s/base/web/05-deployment-web-sidecar.yaml
- boilerplate/infra/k8s/base/management-web/04-deployment-management-web.yaml
- boilerplate/infra/env/overrides/remote-k8s.yaml
- boilerplate/docs/development/K8S-ENV-RENDER.md
- k.podcastdj.com/apps/boilerplate-alpha/management-web/configmap-management-web-sidecar.yaml (API_SERVER_BASE_URL and MANAGEMENT_API_SERVER_BASE_URL to in-cluster Services)
