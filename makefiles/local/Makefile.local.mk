# Boilerplate Makefile (local targets)
# Included from root Makefile. Run the same checks CI will run. See README or plan 05 for usage.
#
# Main targets:
#   validate, validate_docker  - Pre-push checks and optional Docker image build
#   audit, audit-fix           - Dependency audit (script from plan 06)
#   local_network_create       - Create boilerplate_local_network (idempotent)
#   local_postgres_up, local_valkey_up  - Start Postgres and Valkey
#   local_sidecar_up, local_api_up, local_web_up  - Start sidecar, API, web
#   local_apps_up, local_apps_down  - Start or stop only app containers (API, sidecar, web); infra unchanged
#   local_down                 - Stop all local Docker services (keeps volumes)
#   local_down_volumes         - Stop services and remove volumes (clean DB/Valkey data)
#   local_clean               - Run local_down then local_down_volumes (full teardown)
#   env_setup                 - Copy env templates to infra/config/local and apps (idempotent)
#   local_env_remove          - Run local_clean (tear down containers and volumes), then remove .env files (prompts for Y); run env_setup to recreate
#   local_infra_up            - Start Postgres and Valkey only (for API/web on host)
#   local_all_up              - Start full stack in Docker (API, web, sidecar, Postgres, Valkey)
#   test_deps, test_postgres_up, test_valkey_up, test_db_init, help_test, test_clean - Test requirements (ports 5532, 6479)
#
SHELL := /bin/bash

COMPOSE_LOCAL := infra/docker/local/docker-compose.yml
LOCAL_NETWORK := boilerplate_local_network
ENV_TEMPLATES := infra/config/env-templates

include makefiles/local/Makefile.local.validate.mk
include makefiles/local/Makefile.local.audit.mk
include makefiles/local/Makefile.local.env.mk
include makefiles/local/Makefile.local.docker.mk
include makefiles/local/Makefile.local.test.mk
