# local-postgres-wait-user

### Session 1 - 2026-03-22

#### Prompt (Developer)

@terminals/35.txt:10-56 what is the problem? is it misalignment with .env db user name?

#### Key Decisions

- Root cause: `local_postgres_wait` queried `pg_roles` for `rolname='read'` but `01_create_users.sh` creates `POSTGRES_READ_USER` (default `boilerplate_app_read`). Not an API `.env` connection issue—the check runs inside Docker as superuser `postgres`.
- Fix: `LOCAL_POSTGRES_READ_USER ?= boilerplate_app_read` in `Makefile.local.env.mk` and use it in the wait query in `Makefile.local.docker.mk`. Override with `make LOCAL_POSTGRES_READ_USER=...` if `db.env` uses a different read role name.

#### Files Modified

- makefiles/local/Makefile.local.env.mk
- makefiles/local/Makefile.local.docker.mk
