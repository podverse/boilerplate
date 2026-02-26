# Local Docker

API (4000), web (4100), sidecar (4101), postgres (5433), valkey (6380). Shared network: `boilerplate_local_network`. Host ports 5433/6380 avoid conflict with podverse monorepo (5432/6379).

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

Postgres runs `infra/database/combined/init_database.sql` on first start. API/ORM use DB_HOST=postgres and VALKEY_HOST=valkey when running in Docker.

## Build only

- API: `docker compose -f infra/docker/local/api/docker-compose.yml build` (from api dir, or use combined compose with --project-directory .)
- Combined: `docker compose -f infra/docker/local/docker-compose.yml --project-directory . build`

If using per-service compose files, create the network first:  
`docker network create boilerplate_local_network`
