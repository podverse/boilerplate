# --- Local env setup (aligned with Podverse: prepare, link, setup, clean). ---

.PHONY: local_env_prepare local_env_link local_env_setup local_env_clean local_setup
.PHONY: env_setup local_env_remove local_db_init_management local_reset_env_infra

# Local Postgres container (from docker-compose) and management DB name for dev
LOCAL_PG_CONTAINER ?= boilerplate_local_postgres
LOCAL_PG_USER ?= postgres
LOCAL_MANAGEMENT_DB_NAME ?= boilerplate_management
# Cluster name for local k3d (must match scripts/infra/k3d/*.sh)
K3D_CLUSTER_NAME ?= boilerplate-local

local_env_prepare:
	bash scripts/local-env/prepare-overrides.sh

local_env_link:
	bash scripts/local-env/link-overrides.sh

# Non-destructive local env setup: create missing env files, generate secrets, apply overrides from dev/env-overrides/local/*.env
local_env_setup:
	bash scripts/local-env/setup.sh
	@echo "Local env setup complete."

local_env_clean:
	@running=$$(docker ps -q --filter "name=boilerplate_local_" 2>/dev/null); \
	if [ -n "$$running" ]; then \
		echo "ERROR: local_env_clean cannot run while Boilerplate local containers are running."; \
		echo "Stop them first with: make local_down"; \
		docker ps --filter "name=boilerplate_local_" --format "  {{.Names}}"; \
		exit 1; \
	fi
	@if k3d cluster list "$(K3D_CLUSTER_NAME)" >/dev/null 2>&1; then \
		echo "ERROR: local_env_clean cannot run while the k3d cluster is running."; \
		echo "Stop it first with: make local_k3d_down"; \
		exit 1; \
	fi
	@echo "Removing local env files (keeping dev/env-overrides/local/*.env)..."
	@rm -f $(ROOT)infra/config/local/*.env \
		$(ROOT)apps/api/.env \
		$(ROOT)apps/web/.env.local \
		$(ROOT)apps/management-api/.env \
		$(ROOT)apps/management-web/.env.local
	@echo "Local env files removed. Run make local_env_setup to regenerate."

# One-shot: env setup then start Postgres, Valkey, management DB, and create super admin.
local_setup: local_env_setup local_infra_up

# Backward-compatible alias (canonical target is local_env_setup). See docs/development/LOCAL-ENV-OVERRIDES.md.
env_setup: local_env_setup
	@echo "Env files ready (infra/config/local/*.env, apps/*/.env or .env.local)."
	@echo "apps/api/.env is set for API-on-host (localhost:5433, localhost:6380). infra/config/local/api.env is for Docker (postgres, valkey)."
	@echo "apps/management-api/.env is set for Management API on host. make local_infra_up creates the management DB and then prompts for super admin (password generated and printed once)."

# Remove local .env files (prompts for Y). Runs local_clean first. Prefer prepare/link/setup flow; see docs/development/LOCAL-ENV-OVERRIDES.md.
local_env_remove: local_clean
	@bash scripts/remove-local-env.sh

# Full reset: remove env and containers, recreate env, then bring up Postgres, Valkey, and management DB.
# Pass testSuperAdmin=1 to create username superadmin with password Test!1Aa (local-only): make local_reset_env_infra testSuperAdmin=1
local_reset_env_infra:
	$(MAKE) local_env_remove
	$(MAKE) env_setup
	$(MAKE) local_infra_up testSuperAdmin=$(testSuperAdmin)

# Create management database in local Postgres (boilerplate_local_postgres). Run after local_infra_up.
# Idempotent: drops and recreates boilerplate_management, applies schema, grants read/read_write.
local_db_init_management:
	@docker ps -q -f name=^/$(LOCAL_PG_CONTAINER)$$ | grep -q . || (echo "Error: Start local Postgres first: make local_infra_up"; exit 1)
	@echo "Creating management database $(LOCAL_MANAGEMENT_DB_NAME)..."
	@docker exec $(LOCAL_PG_CONTAINER) psql -U $(LOCAL_PG_USER) -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$(LOCAL_MANAGEMENT_DB_NAME)' AND pid <> pg_backend_pid();" 2>/dev/null || true
	@docker exec $(LOCAL_PG_CONTAINER) psql -U $(LOCAL_PG_USER) -d postgres -c "DROP DATABASE IF EXISTS $(LOCAL_MANAGEMENT_DB_NAME);"
	@docker exec $(LOCAL_PG_CONTAINER) psql -U $(LOCAL_PG_USER) -d postgres -c "CREATE DATABASE $(LOCAL_MANAGEMENT_DB_NAME);"
	@cat infra/management-database/combined/init_management_database.sql | docker exec -i $(LOCAL_PG_CONTAINER) psql -U $(LOCAL_PG_USER) -d $(LOCAL_MANAGEMENT_DB_NAME)
	@docker exec $(LOCAL_PG_CONTAINER) psql -U $(LOCAL_PG_USER) -d $(LOCAL_MANAGEMENT_DB_NAME) -c " \
		GRANT CONNECT ON DATABASE $(LOCAL_MANAGEMENT_DB_NAME) TO read, read_write; \
		GRANT USAGE ON SCHEMA public TO read, read_write; \
		GRANT SELECT ON ALL TABLES IN SCHEMA public TO read; \
		GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO read; \
		GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public TO read_write; \
		GRANT SELECT, USAGE, UPDATE ON ALL SEQUENCES IN SCHEMA public TO read_write; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO read; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO read; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO read_write; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, USAGE, UPDATE ON SEQUENCES TO read_write;"
	@echo "Management database $(LOCAL_MANAGEMENT_DB_NAME) ready. Management API can connect (apps/management-api/.env)."
