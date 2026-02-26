# Plan 03: Add Postgres

## Scope

Add a Postgres service to docker-compose and init script(s) in `infra/database/`. Document port
and env vars (e.g. DATABASE_URL or DB_HOST, DB_PORT, DB_NAME, user, password). Used by the ORM
package (plan 12) and auth (plan 15).

## Steps

1. **Init script**
   - Create `infra/database/combined/init_database.sql` (or `infra/database/init_database.sql`).
   - Minimal content: a short comment or empty file is enough for now. The Postgres image
     already creates the database from POSTGRES_DB. Plan 12 (ORM) will add the users table
     either via a migration or by expanding this init script; do not add schema here unless
     you have chosen init-only schema in plan 12.

2. **Docker service**
   - Add a service named **postgres** (use this exact name so DB_HOST=postgres in env works)
     to the compose file used in plan 02 (e.g. `infra/docker/local/docker-compose.yml` or a
     dedicated db compose).
   - Image: postgres:18.1 (or current LTS).
   - Environment: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB.
   - Volumes: mount init script into `/docker-entrypoint-initdb.d/` so it runs on first start.
   - Port: expose 5432 to host (e.g. 127.0.0.1:5432:5432).
   - Attach to shared network so api can connect.

3. **Config and env**
   - Add `infra/config/env-templates/db.env.example` (or document in api.env.example) with
     DB_HOST=postgres, DB_PORT=5432, DB_NAME=metaboost (or same as POSTGRES_DB),
     DB_USER=..., DB_PASSWORD=..., and optionally DATABASE_URL.
   - Ensure api (and later orm) can read these (e.g. from infra/config/local/db.env or
     api.env).

4. **Documentation**
   - Update README or infra docs: how to start Postgres, required env vars, and that the api
     (and orm) connect to this service when running in Docker.

## Key files

- `infra/database/combined/init_database.sql` (or `infra/database/init_database.sql`)
- Compose file that defines the postgres service
- `infra/config/env-templates/db.env.example` or equivalent
- README or infra docs

## Verification

- `docker compose up postgres` (or equivalent) starts Postgres; init script runs on first run
  (check logs or connect and list tables).
- Connect with psql or a client using the documented env vars; confirm database and user exist.
