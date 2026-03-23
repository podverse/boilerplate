# dev-all-watch-sidecar-env

## Metadata

- **Started:** 2026-03-22
- **Context:** Fix `npm run dev:all:watch` after `local_env_setup` + `local_infra_up` (sidecar dotenv path, `ip-address` for express-rate-limit, docs).

### Session 1 - 2026-03-22

#### Prompt (Developer)

Debug `npm run dev:all:watch` after `local_env_setup` + `local_infra_up`

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **`DOTENV_CONFIG_PATH=sidecar/.env`**: Host dev sidecars no longer load `apps/web/.env` by default; [`scripts/local-env/setup.sh`](scripts/local-env/setup.sh) copies `infra/config/local/web-sidecar.env` and `management-web-sidecar.env` into `apps/*/sidecar/.env` after setup. [`local_env_clean`](makefiles/local/Makefile.local.env.mk) removes those copies.
- **`ip-address`**: Added direct dependency to [`packages/helpers-backend-api/package.json`](packages/helpers-backend-api/package.json) so `express-rate-limit` resolves its transitive dep reliably.
- **Docs**: [LOCAL-ENV-OVERRIDES.md](docs/development/LOCAL-ENV-OVERRIDES.md) documents copy + `DOTENV_CONFIG_PATH`; [QUICK-START.md](docs/QUICK-START.md) fixes default web/sidecar ports (4002 / 4001) and points to overrides doc.

#### Files Created/Modified

- `scripts/local-env/setup.sh`
- `apps/web/package.json`
- `apps/management-web/package.json`
- `packages/helpers-backend-api/package.json`
- `package-lock.json`
- `makefiles/local/Makefile.local.env.mk`
- `docs/development/LOCAL-ENV-OVERRIDES.md`
- `docs/QUICK-START.md`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 2 - 2026-03-22

#### Prompt (Developer)

Fix web runtime-config client hydration

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Switched runtime-config script injection to Next's `Script` component with `strategy='beforeInteractive'` so client execution is framework-supported.
- Updated `apps/web` root layout to fetch runtime config from the sidecar on the server (`fetchWebRuntimeConfigFromSidecar`) and populate the runtime-config store (`setRuntimeConfig`) before rendering client auth code.
- Verified fix with `npm run dev:all:watch` smoke run and HTTP checks: `/` now redirects to `/login` (307) instead of throwing `NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS is required`; runtime-config script payload now includes `NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS` and other sidecar keys.

#### Files Created/Modified

- `apps/web/src/components/Head/RuntimeConfigScript.tsx`
- `apps/web/src/app/layout.tsx`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 3 - 2026-03-23

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt it looks like there may already be processes running on ports that boilerplate needed needed. Write a helper script development for boilerplate that will automatically try to find and kill all processes on the machine that are blocking the ports needed for boilerplate to run.

#### Key Decisions

- Added a new helper script at `scripts/development/kill-boilerplate-port-blockers.sh` to find listeners on Boilerplate's default local-dev ports and terminate them (`SIGTERM` first, then `SIGKILL` for remaining PIDs).
- Included a safe `--dry-run` mode and optional `--ports` override to support both default cleanup and targeted cleanup workflows.
- Kept the script macOS-compatible (Bash 3.2) by avoiding `mapfile`.

#### Files Created/Modified

- `scripts/development/kill-boilerplate-port-blockers.sh`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 4 - 2026-03-23

#### Prompt (Developer)

Fix EADDRINUSE on Sidecar Ports

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **Root fix**: Changed `dev:all:watch` in root `package.json` to use `dev:sidecar` instead of `dev:sidecar:watch` for the web sidecar. The web sidecar just serves env vars; nodemon supervision caused its child listener PID to be respawned immediately after the kill script terminated it.
- **Kill script hardening**: Added Phase 2 (kill supervisor processes: nodemon, `next dev --webpack`, `storybook dev -p`, and any node/npm with boilerplate repo paths in the command) and Phase 4 (post-kill verification loop that polls target ports for up to 10 seconds and exits with error if any remain blocked).

#### Files Created/Modified

- `package.json`
- `scripts/development/kill-boilerplate-port-blockers.sh`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 5 - 2026-03-23

#### Prompt (Developer)

is there a "nuke_rebuild" command in the boilerplate make file somewhere? if not, then add one

#### Key Decisions

- Added `local_nuke_rebuild_run` target to `makefiles/local/Makefile.local.env.mk` (near `local_reset_env_infra`), aligned with Podverse naming. Sequence: kill port blockers → `local_clean` → `local_env_clean` → `local_env_setup` → `local_infra_up`. Fully non-interactive (unlike `local_reset_env_infra` which runs `scripts/remove-local-env.sh` with a Y/N prompt). Accepts `testSuperAdmin=1` to pass through to `local_infra_up`.
- Documented in `Makefile.local.mk` comment block.

#### Files Created/Modified

- `makefiles/local/Makefile.local.env.mk`
- `makefiles/local/Makefile.local.mk`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 6 - 2026-03-23

#### Prompt (Developer)

you didn't align it it should be local_nuke_rebuild_run

#### Key Decisions

- Renamed target from `local_nuke_rebuild` to `local_nuke_rebuild_run` to match Podverse (`makefiles/local/Makefile.local.env.mk`, `Makefile.local.mk` header comment).

#### Files Created/Modified

- `makefiles/local/Makefile.local.env.mk`
- `makefiles/local/Makefile.local.mk`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 7 - 2026-03-23

#### Prompt (Developer)

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/35.txt:7-32 nuke should NOT run the process kill job. that process kill script should never happen through make files. it is a dev script they can run as needed. also, can we avoid the process kill script from killing docker in the process? the goal is to only kill processes that may be running outside of docker containers, like 4000 4001 4002 4100 4101 4102 all of which may be run with npm run dev instead of within a docker container

#### Key Decisions

- Removed `kill-boilerplate-port-blockers.sh` from `local_nuke_rebuild_run` in `makefiles/local/Makefile.local.env.mk`; Make comments point devs to run the script manually when needed.
- Kill script defaults to host app ports only (`4000 4001 4002 4100 4101 4102`); dropped Postgres/Valkey/pgAdmin/Storybook defaults that overlapped Docker-published ports.
- Added `should_skip_pid_for_kill`: skip PID ≤1, Linux cgroup docker/containerd/k8s, and comm/args matching docker-proxy, com.docker, vpnkit, colima, lima, podman, rootlesskit, slirp, gvproxy, etc. Phase 2 supervisors and Phase 4 verification respect the same filter.

#### Files Created/Modified

- `makefiles/local/Makefile.local.env.mk`
- `makefiles/local/Makefile.local.mk`
- `scripts/development/kill-boilerplate-port-blockers.sh`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 8 - 2026-03-23

#### Prompt (Developer)

Align `local_nuke_rebuild_run` with Podverse

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Added `local_prune_boilerplate_images` and `LOCAL_COMPOSE_APP_SERVICES` in `Makefile.local.docker.mk`; `local_apps_up` now uses the variable list; added `local_apps_up_build` (`up -d --build`) and `local_start_all_apps` (alias to `local_apps_up`, Podverse naming).
- `local_nuke_rebuild_run` now runs prune after clean/env_clean, then env_setup, `local_infra_up`, `local_apps_up_build`, and a success banner with URLs. Corrected Path B web port in `QUICK-START.md` (4002; added management URLs).

#### Files Created/Modified

- `makefiles/local/Makefile.local.docker.mk`
- `makefiles/local/Makefile.local.env.mk`
- `makefiles/local/Makefile.local.mk`
- `docs/QUICK-START.md`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`

### Session 9 - 2026-03-23

#### Prompt (Developer)

debug

#### Key Decisions

- Root cause of `make: *** unterminated call to function 'shell'` on `Makefile.local.e2e.mk:16`: GNU Make treats `#` as a comment start even inside `$(shell sed '/^#/d' ...)` — the `^#` after the opening `'` truncates the line. Fixed by escaping the hash for Make: `sed '/^\#/d;/^$$/d'` (seven occurrences) so the shell still receives `^#` / comment-line deletion semantics.

#### Files Created/Modified

- `makefiles/local/Makefile.local.e2e.mk`
- `.llm/history/active/dev-all-watch-sidecar-env/dev-all-watch-sidecar-env-part-01.md`
