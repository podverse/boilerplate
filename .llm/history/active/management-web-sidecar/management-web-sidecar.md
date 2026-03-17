# Management-Web Sidecar (Runtime Config)

- **Started**: 2026-03-16
- **Author**: Developer
- **Context**: Management-web in Boilerplate should have a sidecar just like web does: a runtime-config sidecar that serves env-derived config so the management-web Next.js app can use it when `RUNTIME_CONFIG_URL` is set.

---

### Session 1 - 2026-03-16

#### Prompt (Developer)

management web in boilerplate should have a sidecar just like web does

#### Key Decisions

- Sidecar port 4111; web sidecar stays 4001. Management-web minimal env template only sets `RUNTIME_CONFIG_URL`; full vars in management-web-sidecar.env.example.
- Root package.json: added workspace `apps/management-web/sidecar`, build:apps and type-check include `@boilerplate/management-web-sidecar`; added `dev:management-web-sidecar` script.
- Combined docker-compose: web sidecar uses `web-sidecar.env` (fixed from web.env); new service `boilerplate_local_management_web_sidecar` with own Dockerfile; management-web depends on it and sets `RUNTIME_CONFIG_URL`.
- Makefile: local_management_web_sidecar_up/down, local_apps_up includes management-web-sidecar, local_management_web_up depends on sidecar.

#### Files Created/Modified

- `package.json` (workspaces, build:apps, type-check, dev:management-web-sidecar)
- `apps/management-web/package.json` (dev:sidecar script, dotenv devDependency)
- `infra/docker/local/management-web-sidecar/Dockerfile` (new)
- `infra/docker/local/docker-compose.yml` (web-sidecar env_file fix; management-web-sidecar service; management-web depends_on + RUNTIME_CONFIG_URL)
- `makefiles/local/Makefile.local.docker.mk` (management-web-sidecar targets, local_apps_up/down)
- `makefiles/local/Makefile.local.mk` (comment updates)
- `infra/docker/local/INFRA-DOCKER-LOCAL.md` (sidecars doc, six app containers)
- `dev/env-overrides/local/management-web-sidecar.env.example` (new)
