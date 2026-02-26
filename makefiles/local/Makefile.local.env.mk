# --- Env setup and local .env removal. ---

.PHONY: env_setup local_env_remove

# Copy env templates so Docker and apps have env (idempotent). App envs use app .env.example as source.
env_setup:
	@mkdir -p infra/config/local
	@[ -f infra/config/local/api.env ] || cp apps/api/.env.example infra/config/local/api.env
	@[ -f infra/config/local/web.env ] || cp apps/web/.env.example infra/config/local/web.env
	@[ -f infra/config/local/db.env ] || cp $(ENV_TEMPLATES)/db.env.example infra/config/local/db.env
	@[ -f infra/config/local/valkey.env ] || cp $(ENV_TEMPLATES)/valkey.env.example infra/config/local/valkey.env
	@[ -f apps/api/.env ] || cp apps/api/.env.example apps/api/.env
	@[ -f apps/web/.env.local ] || cp apps/web/.env.example apps/web/.env.local
	@bash scripts/env-setup-secrets.sh
	@echo "Env files ready (infra/config/local/*.env, apps/api/.env, apps/web/.env.local)."
	@echo "apps/api/.env is set for API-on-host (localhost:5433, localhost:6380). infra/config/local/api.env is for Docker (postgres, valkey)."

# Remove local .env files (prompts for Y). Runs local_clean first so Postgres and Valkey
# containers and volumes are removed; after env_setup, next local_infra_up or local_all_up
# will create DB and Valkey fresh with the new passwords.
local_env_remove: local_clean
	@bash scripts/remove-local-env.sh
