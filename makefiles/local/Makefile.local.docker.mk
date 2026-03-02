# --- Local Docker: network and compose services (infra/docker/local). ---

.PHONY: local_network_create local_infra_up local_all_up local_postgres_wait local_create_super_admin
.PHONY: local_postgres_up local_valkey_up local_pgadmin_up local_sidecar_up local_api_up local_web_up
.PHONY: local_management_api_up local_management_web_up
.PHONY: local_postgres_down local_valkey_down local_sidecar_down local_api_down local_web_down
.PHONY: local_management_api_down local_management_web_down
.PHONY: local_apps_up local_apps_down local_down local_down_volumes local_clean

local_network_create:
	docker network create $(LOCAL_NETWORK) 2>/dev/null || true

# Wait for Postgres to accept connections and init users (read/read_write) so management DB init can run.
local_postgres_wait:
	@echo "Waiting for Postgres (and init users) to be ready..."
	@for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do \
	  docker exec $(LOCAL_PG_CONTAINER) psql -U $(LOCAL_PG_USER) -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='read'" 2>/dev/null | grep -q 1 && exit 0; \
	  sleep 1; \
	done; \
	echo "Error: Timeout waiting for Postgres (and read user). Is Postgres running? Run: make local_infra_up"; exit 1

# Postgres + Valkey + pgAdmin + management DB (so API and Management API on host both have DBs).
# Then prompts for super admin email and creates the super admin user (password generated and printed once).
# pgAdmin is available at http://localhost:4050 — no login required; both databases pre-connected.
local_infra_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d postgres valkey boilerplate_local_pgadmin
	$(MAKE) local_postgres_wait
	$(MAKE) local_db_init_management
	$(MAKE) local_create_super_admin

# Create super admin in management DB. When testSuperAdmin=1 (e.g. make local_reset_env_infra testSuperAdmin=1),
# creates superadmin@example.com with password Test!1Aa (local-only). Otherwise interactive: prompts for email, prints generated password once.
# Requires Postgres and management DB (e.g. after local_infra_up). Uses apps/management-api/.env.
local_create_super_admin:
	$(if $(testSuperAdmin),LOCAL_SUPERADMIN_PASSWORD='Test!1Aa',) node scripts/management-api/create-super-admin.mjs

# Full stack in Docker (Path B: API, web, sidecar, Postgres, Valkey). Does not run env_setup.
local_all_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up --build

local_postgres_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d postgres

local_valkey_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d valkey

local_pgadmin_up: local_network_create local_postgres_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_pgadmin

local_sidecar_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_web_sidecar

local_api_up: local_network_create local_postgres_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_api

local_web_up: local_sidecar_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_web

local_management_api_up: local_network_create local_postgres_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_management_api

local_management_web_up: local_management_api_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_management_web

local_postgres_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop postgres 2>/dev/null || true

local_valkey_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop valkey 2>/dev/null || true

local_sidecar_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop boilerplate_local_web_sidecar 2>/dev/null || true

local_api_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop boilerplate_local_api 2>/dev/null || true

local_web_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop boilerplate_local_web 2>/dev/null || true

local_management_api_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop boilerplate_local_management_api 2>/dev/null || true

local_management_web_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . stop boilerplate_local_management_web 2>/dev/null || true

# Start only app containers (API, management-api, sidecar, web, management-web). Postgres and Valkey must already be running (e.g. local_infra_up).
local_apps_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_api boilerplate_local_management_api boilerplate_local_web_sidecar boilerplate_local_web boilerplate_local_management_web

# Stop only app containers (API, management-api, sidecar, web, management-web). Postgres and Valkey are left running.
local_apps_down: local_api_down local_management_api_down local_sidecar_down local_web_down local_management_web_down

# Remove containers and built app images (api, management-api, web, management-web, web-sidecar). Postgres and
# valkey are pulled images, not built here, so they are never removed and persist for convenience.
local_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . down --rmi local

local_down_volumes:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . down -v --rmi local

local_clean: local_down local_down_volumes
