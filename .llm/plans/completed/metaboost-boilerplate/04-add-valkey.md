# Plan 04: Add Valkey

## Scope

Add a Valkey service to docker-compose and document connection env (host, port, optional
password). Optional healthcheck or entrypoint scripts if mirroring podverse. Used by dashboard
real-time messages (plan 22).

## Steps

1. **Docker service**
   - Add a `valkey` (or `keyvaldb`) service to the compose file (same as in plan 02/03).
   - Image: use a pinned tag for reproducibility (e.g. `valkey/valkey:7` or
     `redis/valkey:7-alpine`). Avoid `latest`.
   - Port: expose 6379 to host (e.g. 127.0.0.1:6379:6379).
   - Optional: command or env for persistence (e.g. appendonly) and password if desired.
   - Attach to shared network so api can connect.

2. **Config and env**
   - Add `infra/config/env-templates/valkey.env.example` (or document in api.env.example) with
     VALKEY_HOST=valkey, VALKEY_PORT=6379, and optional VALKEY_PASSWORD=.
   - Ensure api can read these when running in Docker (e.g. from infra/config/local/valkey.env
     or api.env).

3. **Optional: healthcheck / entrypoint**
   - Optional healthcheck in the compose service (e.g. `test: ["CMD", "valkey-cli", "ping"]`
     or `redis-cli ping` depending on image; set interval/timeout) so that a combined
     compose can use `depends_on: valkey` with `condition: service_healthy` for the api.
   - Optionally an entrypoint script that waits for Valkey before starting the api (plan 02).

4. **Documentation**
   - Update README or infra docs: how to start Valkey, required env vars, and that the api
     will use it for message storage (plan 22).

## Key files

- Compose file that defines the valkey service
- `infra/config/env-templates/valkey.env.example` or equivalent
- Optional: healthcheck in compose; optional entrypoint script
- README or infra docs

## Verification

- `docker compose up valkey` starts Valkey; port 6379 is reachable from host.
- From host or another container: `redis-cli -h localhost -p 6379 ping` (or equivalent)
  returns PONG.
