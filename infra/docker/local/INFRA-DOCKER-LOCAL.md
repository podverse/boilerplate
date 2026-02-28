# Local Docker

API (4000), web (4100), postgres (5433), valkey (6380) exposed on host. Sidecar is **not**
exposed to the host; only the web container reaches it on the internal network via
RUNTIME_CONFIG_URL. Shared network: `boilerplate_local_network`. Host ports 5433/6380 avoid
conflict with podverse monorepo (5432/6379).

## First run

1. Copy env templates into local (gitignored):  
   `cp infra/config/env-templates/api.env.example infra/config/local/api.env`  
   `cp infra/config/env-templates/web.env.example infra/config/local/web.env`  
   `cp infra/config/env-templates/db.env.example infra/config/local/db.env`  
   `cp infra/config/env-templates/valkey.env.example infra/config/local/valkey.env`
2. From repo root:  
   `docker compose -f infra/docker/local/docker-compose.yml --project-directory . up --build`

## Start only Postgres or Valkey

- `docker compose -f infra/docker/local/docker-compose.yml --project-directory . up postgres`
- `docker compose -f infra/docker/local/docker-compose.yml --project-directory . up valkey`

Postgres runs `infra/database/combined/init_database.sql` on first start, then
`seed_local_user.sql`, which inserts a predefined user for local dev: **localdev@example.com** /
**Test!1Aa**. API/ORM use DB_HOST=postgres and VALKEY_HOST=valkey when running in Docker.

## Build only

- API: `docker compose -f infra/docker/local/api/docker-compose.yml build` (from api dir, or use
  combined compose with --project-directory .)
- Combined: `docker compose -f infra/docker/local/docker-compose.yml --project-directory . build`

If using per-service compose files, create the network first:  
`docker network create boilerplate_local_network`

## Postgres 18+ volume

Postgres 18+ uses a volume mount at `/var/lib/postgresql` (not `/var/lib/postgresql/data`). If
Postgres exits with a "pg_ctlcluster" or data-directory error (e.g. after upgrading the image),
remove the old volume and start again:

```bash
make local_down
docker volume rm boilerplate_postgres_data
make local_infra_up
```
