# Plan 02: Docker files (no k8s)

## Scope

Add Dockerfiles and docker-compose for api, web, and web sidecar. Use a shared network and env
files from `infra/config`. Reference: podverse `infra/docker/local/` (api, web, sidecar). No k8s.

## Steps

1. **Shared network**
   - Define a single external network (e.g. `boilerplate_local_network`) so api, web, sidecar,
     postgres, and valkey can share it. Document creation in Makefile or README (e.g.
     `docker network create boilerplate_local_network`).

2. **API**
   - `infra/docker/local/api/Dockerfile`: build from repo root; copy package.json(s), install
     deps, build, run node (or tsc + node). Use Node 24.
   - `infra/docker/local/api/docker-compose.yml`: build api image; use env_file pointing to
     `infra/config/local/api.env` (or env-templates if local not required for CI); expose API
     port (e.g. 4000); attach to shared network.

3. **Web**
   - `infra/docker/local/web/Dockerfile`: multi-stage if desired; build Next.js app; use Node 24.
   - `infra/docker/local/web/docker-compose.yml`: build web image; env from
     `infra/config/local/web.env`; expose web port (e.g. 4100); attach to shared network.

4. **Web sidecar**
   - `infra/docker/local/web-sidecar/Dockerfile`: build sidecar from `apps/web/sidecar`.
   - `infra/docker/local/web-sidecar/docker-compose.yml`: build sidecar; env as needed; expose
     sidecar port (e.g. 4101); attach to shared network.

5. **Combined compose (required)**
   - Add a top-level `infra/docker/local/docker-compose.yml` that declares the shared network
     and includes api, web, and sidecar services. Plans 03 and 04 will add postgres and
     valkey to this file; plan 08 make targets (e.g. local_postgres_up, local_valkey_up) use
     it so `docker compose up` can run all services from one file.

## Key files

- `infra/docker/local/api/Dockerfile`
- `infra/docker/local/api/docker-compose.yml`
- `infra/docker/local/web/Dockerfile`
- `infra/docker/local/web/docker-compose.yml`
- `infra/docker/local/web-sidecar/Dockerfile`
- `infra/docker/local/web-sidecar/docker-compose.yml`
- `infra/docker/local/docker-compose.yml` (combined compose; required for plans 03, 04, 08)
- `infra/config/local/api.env` and `web.env` (templates or examples; document in README)

## Verification

- Create the shared network first (e.g. `docker network create boilerplate_local_network`), or
  use a compose file that declares the network so it is created on first `docker compose up`.
- `docker compose -f infra/docker/local/api/docker-compose.yml build` succeeds.
- With network created and env files present, `docker compose up` for api (and similarly web,
  sidecar) starts the container and the app is reachable on the expected port. Use the same
  ports as in `apps/api/.env.example` and `apps/web/.env.example` (e.g. API 4000, web 4100,
  sidecar 4101).
