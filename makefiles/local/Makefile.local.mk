# Boilerplate Makefile (local targets)
# Included from root Makefile. Run the same checks CI will run. See README or plan 05 for usage.
#
# Main targets:
#   validate, validate_docker  - Pre-push checks and optional Docker image build
#   audit, audit-fix           - Dependency audit (script from plan 06)
#   local_network_create       - Create boilerplate_local_network (idempotent)
#   local_postgres_up, local_valkey_up  - Start Postgres and Valkey
#   local_sidecar_up, local_api_up, local_web_up, local_management_api_up, local_management_web_up  - Start sidecar, API, web, management-api, management-web
#   local_apps_up, local_apps_down  - Start or stop only app containers (API, management-api, sidecar, web, management-web); infra unchanged
#   local_down                 - Stop all local Docker services (keeps volumes)
#   local_down_volumes         - Stop services and remove volumes (clean DB/Valkey data)
#   local_clean               - Run local_down then local_down_volumes (full teardown)
#   env_setup                  - Copy env templates to infra/config/local and apps (idempotent)
#   local_env_remove           - Run local_clean (tear down containers and volumes), then remove .env files (prompts for Y); run env_setup to recreate
#   local_reset_env_infra      - Run local_env_remove, env_setup, then local_infra_up. Use testSuperAdmin=1 for superadmin@example.com / Test!1Aa
#   local_db_init_management  - Create boilerplate_management DB in local Postgres (also run by local_infra_up)
#   local_create_super_admin - Interactive: prompt for super admin email, create user, print password once (run by local_infra_up)
#   local_infra_up            - Start Postgres, Valkey, and management DB, then create super admin (for API + Management API on host)
#   local_all_up              - Start full stack in Docker (API, web, sidecar, Postgres, Valkey)
#   test_deps, test_postgres_up, test_valkey_up, test_db_init, test_db_init_management, test_db_list, help_test, test_clean - Test requirements (ports 5532, 6479)
#   e2e_deps, e2e_seed, e2e_seed_web, e2e_seed_management_web, e2e_test_api, e2e_test, e2e_test_web, e2e_test_management_web, e2e_teardown - E2E page testing (see docs/testing/E2E-PAGE-TESTING.md)
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
include makefiles/local/Makefile.local.e2e.mk
