# --- Env setup and local .env removal. ---

.PHONY: env_setup local_env_remove

# Copy env templates so Docker and apps have env (idempotent).
env_setup:
	@mkdir -p infra/config/local
	@[ -f infra/config/local/api.env ] || cp $(ENV_TEMPLATES)/api.env.example infra/config/local/api.env
	@[ -f infra/config/local/web.env ] || cp $(ENV_TEMPLATES)/web.env.example infra/config/local/web.env
	@[ -f infra/config/local/db.env ] || cp $(ENV_TEMPLATES)/db.env.example infra/config/local/db.env
	@[ -f infra/config/local/valkey.env ] || cp $(ENV_TEMPLATES)/valkey.env.example infra/config/local/valkey.env
	@[ -f apps/api/.env ] || cp apps/api/.env.example apps/api/.env
	@[ -f apps/web/.env.local ] || cp apps/web/.env.example apps/web/.env.local
	@echo "Env files ready (infra/config/local/*.env, apps/api/.env, apps/web/.env.local)."
	@echo "For API on host: set DB_HOST=localhost, DB_PORT=5433, VALKEY_HOST=localhost, VALKEY_PORT=6380 in apps/api/.env"

# Remove local .env files. Script prompts for Y to confirm. Use with env_setup to test clean start.
local_env_remove:
	bash scripts/remove-local-env.sh
