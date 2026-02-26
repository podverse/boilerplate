# Plan 08: Makefiles

## Scope

Add or extend root Makefile to include: `validate` (plan 05), `audit` (call script from plan 06),
and targets for Docker (e.g. local_network_create, local_api_up, local_web_up,
local_postgres_up, local_valkey_up). No k8s. Can split into Makefile + Makefile.local.infra
included from root.

## Steps

1. **Phony and shell**
   - Declare `.PHONY` for validate, validate_docker, audit, and all local_* targets.
   - Set SHELL if needed (e.g. for Darwin vs Linux).

2. **validate / validate_docker**
   - Plan 05 runs first and creates the root Makefile with the validate (and optionally
     validate_docker) targets. This plan extends that same Makefile; do not duplicate or
     overwrite the validate recipe. Ensure `make validate` and optionally `make
     validate_docker` still work after adding the new targets below.

3. **audit**
   - Target `audit`: run `./scripts/audit/audit.sh` (or `bash scripts/audit/audit.sh`). Optional
     `audit-fix` that runs with `--fix`.

4. **Network**
   - Target `local_network_create`: run `docker network create boilerplate_local_network` (or
     name chosen in plan 02); use `|| true` or check existence so idempotent.

5. **Docker service targets**
   - `local_postgres_up`: start postgres service (compose file from plan 03); ensure network
     exists (depend on local_network_create).
   - `local_valkey_up`: start valkey service (plan 04); same network.
   - `local_api_up`: start api container (plan 02); env from infra/config/local/api.env;
     depend on network; optionally depend on local_postgres_up if api needs DB.
   - `local_web_up`: start web container; optional dependency on sidecar.
   - `local_sidecar_up`: start web sidecar.
   - Down targets: `local_api_down`, `local_web_down`, `local_postgres_down`,
     `local_valkey_down`, or a single `local_down` that stops all.

6. **Include optional Makefile.local.infra**
   - If splitting: put local_* targets in `Makefile.local.infra` and in root Makefile add
     `-include Makefile.local.infra` (dash so missing file is not error). Document in
     README.

7. **Documentation**
   - Comment at top of Makefile or in README: list of main targets (validate, audit,
     local_network_create, local_postgres_up, local_valkey_up, local_api_up, local_web_up,
     local_down).

## Key files

- `Makefile` (root)
- Optional: `Makefile.local.infra`
- README or docs update

## Verification

- `make audit` runs audit script and exits with same code as script.
- `make local_network_create` creates network (or is idempotent).
- `make local_postgres_up` and `make local_valkey_up` start services (with env files
  present).
- `make local_api_up` starts api (with api env and network).
- `make local_down` (or per-service down) stops services cleanly.
