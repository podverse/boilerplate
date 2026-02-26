# Infra

Directory layout for local and containerized run of the Boilerplate stack (aligned with podverse
monorepo conventions). No k8s in this repo.

## Layout

- **config/env-templates/** – Template env files (`api.env.example`, `web.env.example`) for API
  and web. Canonical app-level templates live under `apps/api/.env.example` and
  `apps/web/.env.example`.
- **config/local/** – Optional local overrides. This directory is gitignored; put local env files
  here so they are never committed. **Required for Docker:** copy templates here before
  `docker compose up`, e.g. `cp infra/config/env-templates/api.env.example
infra/config/local/api.env` and same for `web.env`.
- **database/** – Postgres init: numbered migrations in `database/migrations/` (e.g.
  0000_init_helpers.sql, 0001_users.sql). Run `scripts/database/combine-migrations.sh` to generate
  `database/combined/init_database.sql`; do not edit that file by hand. With 01_create_users.sh, it
  runs on first Postgres start (plan 03; plan 12).
- **docker/local/** – Dockerfiles and docker-compose for api, web, sidecar, postgres, and valkey.
  Combined stack (from repo root): `docker compose -f infra/docker/local/docker-compose.yml
--project-directory . up --build`. Shared network `boilerplate_local_network` is created on first
  up. Copy `infra/config/env-templates/db.env.example` and `valkey.env.example` to
  `infra/config/local/` for DB and Valkey env when running the API in Docker.
