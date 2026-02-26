# --- Local Docker: network and compose services (infra/docker/local). ---

.PHONY: local_network_create local_infra_up local_all_up
.PHONY: local_postgres_up local_valkey_up local_sidecar_up local_api_up local_web_up
.PHONY: local_postgres_down local_valkey_down local_sidecar_down local_api_down local_web_down
.PHONY: local_apps_up local_apps_down local_down local_down_volumes local_clean

local_network_create:
	docker network create $(LOCAL_NETWORK) 2>/dev/null || true

# Postgres + Valkey only (for running API and web on host).
local_infra_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d postgres valkey

# Full stack in Docker (Path B: API, web, sidecar, Postgres, Valkey). Does not run env_setup.
local_all_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up --build

local_postgres_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d postgres

local_valkey_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d valkey

local_sidecar_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_web_sidecar

local_api_up: local_network_create local_postgres_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_api

local_web_up: local_sidecar_up
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_web

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

# Start only app containers (API, sidecar, web). Postgres and Valkey must already be running (e.g. local_infra_up).
local_apps_up: local_network_create
	docker compose -f $(COMPOSE_LOCAL) --project-directory . up -d boilerplate_local_api boilerplate_local_web_sidecar boilerplate_local_web

# Stop only app containers (API, sidecar, web). Postgres and Valkey are left running.
local_apps_down: local_api_down local_sidecar_down local_web_down

# Remove containers and built app images (boilerplate-api, boilerplate-web, boilerplate-web-sidecar). Postgres and
# valkey are pulled images, not built here, so they are never removed and persist for convenience.
local_down:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . down --rmi local

local_down_volumes:
	docker compose -f $(COMPOSE_LOCAL) --project-directory . down -v --rmi local

local_clean: local_down local_down_volumes
