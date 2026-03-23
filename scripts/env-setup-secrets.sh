#!/usr/bin/env bash
# Set host connection defaults in app .env files (DB_HOST, DB_PORT, VALKEY_HOST, VALKEY_PORT, etc.).
# Secrets (DB, Valkey, JWT) are generated and written in scripts/local-env/setup.sh. This script
# is idempotent and only sets host/port/DB name defaults for running apps on host against local Docker.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT" || exit 1

API_DOT_ENV="apps/api/.env"
MGMT_API_DOT_ENV="apps/management-api/.env"

# apps/api/.env: use localhost and mapped ports when API runs on host (DB/Valkey in Docker).
if [ -f "$API_DOT_ENV" ]; then
  for var_value in "DB_HOST:localhost" "DB_PORT:5433" "VALKEY_HOST:localhost" "VALKEY_PORT:6380"; do
    var="${var_value%%:*}"
    value="${var_value#*:}"
    if grep -q "^${var}=" "$API_DOT_ENV" 2>/dev/null; then
      sed -i.bak "s|^${var}=.*|${var}=\"${value}\"|" "$API_DOT_ENV"
      rm -f "${API_DOT_ENV}.bak"
    else
      echo "${var}=\"${value}\"" >> "$API_DOT_ENV"
    fi
  done
  echo "Set host connection defaults in apps/api/.env (DB_HOST=localhost, DB_PORT=5433, VALKEY_HOST=localhost, VALKEY_PORT=6380)."
fi

# apps/management-api/.env: host connection defaults (main DB and management DB same host/port).
# Usernames must match infra/config/local/db.env / db.env.example (Podverse-style role names), not generic read/read_write.
if [ -f "$MGMT_API_DOT_ENV" ]; then
  for var_value in "DB_HOST:localhost" "DB_PORT:5433" "DB_NAME:boilerplate_app" "DB_READ_USERNAME:boilerplate_app_read" "DB_READ_WRITE_USERNAME:boilerplate_app_read_write" "MANAGEMENT_DB_HOST:localhost" "MANAGEMENT_DB_PORT:5433" "MANAGEMENT_DB_NAME:boilerplate_management" "MANAGEMENT_DB_USERNAME:boilerplate_management_read_write"; do
    var="${var_value%%:*}"
    value="${var_value#*:}"
    if grep -q "^${var}=" "$MGMT_API_DOT_ENV" 2>/dev/null; then
      sed -i.bak "s|^${var}=.*|${var}=\"${value}\"|" "$MGMT_API_DOT_ENV"
      rm -f "${MGMT_API_DOT_ENV}.bak"
    else
      echo "${var}=\"${value}\"" >> "$MGMT_API_DOT_ENV"
    fi
  done
  echo "Set host connection defaults in apps/management-api/.env (localhost:5433, boilerplate_management)."
fi
