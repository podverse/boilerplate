# --- Env setup and local .env removal. ---

.PHONY: env_setup local_env_remove local_db_init_management local_reset_env_infra

# Local Postgres container (from docker-compose) and management DB name for dev
LOCAL_PG_CONTAINER ?= boilerplate_local_postgres
LOCAL_PG_USER ?= postgres
LOCAL_MANAGEMENT_DB_NAME ?= boilerplate_management

# Copy env templates so Docker and apps have env (idempotent). App envs use app .env.example as source.
env_setup:
	@mkdir -p infra/config/local
	@[ -f infra/config/local/api.env ] || cp apps/api/.env.example infra/config/local/api.env
	@[ -f infra/config/local/web.env ] || cp apps/web/.env.example infra/config/local/web.env
	@[ -f infra/config/local/management-api.env ] || cp apps/management-api/.env.example infra/config/local/management-api.env
	@[ -f infra/config/local/management-web.env ] || cp apps/management-web/.env.example infra/config/local/management-web.env
	@[ -f infra/config/local/db.env ] || cp $(ENV_TEMPLATES)/db.env.example infra/config/local/db.env
	@[ -f infra/config/local/valkey.env ] || cp $(ENV_TEMPLATES)/valkey.env.example infra/config/local/valkey.env
	@[ -f apps/api/.env ] || cp apps/api/.env.example apps/api/.env
	@[ -f apps/web/.env.local ] || cp apps/web/.env.example apps/web/.env.local
	@[ -f apps/management-api/.env ] || cp apps/management-api/.env.example apps/management-api/.env
	@[ -f apps/management-web/.env.local ] || cp apps/management-web/.env.example apps/management-web/.env.local
	@bash scripts/env-setup-secrets.sh
	@echo "Env files ready (infra/config/local/*.env, apps/*/.env or .env.local)."
	@echo "apps/api/.env is set for API-on-host (localhost:5433, localhost:6380). infra/config/local/api.env is for Docker (postgres, valkey)."
	@echo "apps/management-api/.env is set for Management API on host. make local_infra_up creates the management DB; or run 'make local_db_init_management' after Postgres is up."

# Remove local .env files (prompts for Y). Runs local_clean first so Postgres and Valkey
# containers and volumes are removed; after env_setup, next local_infra_up or local_all_up
# will create DB and Valkey fresh with the new passwords.
local_env_remove: local_clean
	@bash scripts/remove-local-env.sh

# Full reset: remove env and containers, recreate env from templates, then bring up Postgres, Valkey, and management DB.
local_reset_env_infra:
	$(MAKE) local_env_remove
	$(MAKE) env_setup
	$(MAKE) local_infra_up

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
