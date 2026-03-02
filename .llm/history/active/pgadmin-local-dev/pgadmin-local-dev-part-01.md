# pgAdmin Local Dev Setup

- **Started**: 2026-03-02
- **Author**: Developer
- **Context**: Add pgAdmin 4 as a local-only Docker service so both databases are pre-connected and browsable at http://localhost:4050.

---

### Session 1 - 2026-03-02

#### Prompt (Agent)

pgAdmin Local Dev Setup

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Used `dpage/pgadmin4:latest` image on port 4050 (between API ports 4000-4002 and management ports 4100-4102).
- Desktop mode (`PGADMIN_CONFIG_SERVER_MODE=False`, `PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=False`) so no login screen.
- Custom entrypoint writes `/pgpass` from `$DB_POSTGRES_PASSWORD` (sourced via `db.env`) before starting pgAdmin.
- Single server entry in `servers.json` pointing to the `postgres` container — both `postgres` and `boilerplate_management`
  databases appear in the tree automatically.
- Added `boilerplate_pgadmin_data` named volume for pgAdmin state persistence.

#### Files Created/Modified

- `infra/docker/local/docker-compose.yml`
- `infra/docker/local/pgadmin/servers.json`

---

### Session 2 - 2026-03-02

#### Prompt (Developer)

make local_reset_env_infra testSuperAdmin=1

I just ran this command, but I don't see a Postgres on port forty fifty

Should I be seeing it there or am I misunderstanding how it works? I was thinking that I would see a service running

#### Key Decisions

- `local_infra_up` only named `postgres valkey` explicitly — pgAdmin was never started by it.
- Added `boilerplate_local_pgadmin` to the `local_infra_up` compose up command so it starts automatically.
- Added a standalone `local_pgadmin_up` Make target for convenience.

#### Files Modified

- `makefiles/local/Makefile.local.docker.mk`

---

### Session 3 - 2026-03-02

#### Prompt (Agent)

Fix pgAdmin Permission Error

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Changed pgpass path from `/pgpass` to `/tmp/pgpass` — pgadmin user (uid 5050) cannot write to container
  root filesystem; `/tmp` is world-writable.
- Removed `boilerplate_pgadmin_data` named volume — pgAdmin is a stateless client tool here; server
  connections come from `servers.json` and passwords from pgpass, so nothing critical needs persisting.

#### Files Modified

- `infra/docker/local/docker-compose.yml`
- `infra/docker/local/pgadmin/servers.json`

---

### Session 4 - 2026-03-02

#### Prompt (Agent)

Fix pgAdmin Password Injection

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- Bug 1: env var was `DB_POSTGRES_PASSWORD` but db.env uses `POSTGRES_PASSWORD` (standard postgres image var) —
  corrected to `POSTGRES_PASSWORD`.
- Bug 2: the `\"...\"`  wrapping in the old entrypoint wrote literal `"` characters into the pgpass file,
  breaking the format — switched to YAML list entrypoint form so the `-c` argument is passed as a single
  exec arg with no extra shell quoting layer.

#### Files Modified

- `infra/docker/local/docker-compose.yml`
