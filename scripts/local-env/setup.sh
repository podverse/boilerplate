#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

ENV_TEMPLATES="infra/config/env-templates"
OVERRIDES_DIR="dev/env-overrides/local"

DB_ENV="infra/config/local/db.env"
VALKEY_ENV="infra/config/local/valkey.env"
API_INFRA_ENV="infra/config/local/api.env"
WEB_INFRA_ENV="infra/config/local/web.env"
MANAGEMENT_API_INFRA_ENV="infra/config/local/management-api.env"
MANAGEMENT_WEB_INFRA_ENV="infra/config/local/management-web.env"
API_APP_ENV="apps/api/.env"
WEB_APP_ENV="apps/web/.env.local"
MANAGEMENT_API_APP_ENV="apps/management-api/.env"
MANAGEMENT_WEB_APP_ENV="apps/management-web/.env.local"

# Ensure all required env files exist (copy from templates/examples when missing)
mkdir -p infra/config/local
[ -f "$DB_ENV" ] || cp "$ENV_TEMPLATES/db.env.example" "$DB_ENV"
[ -f "$VALKEY_ENV" ] || cp "$ENV_TEMPLATES/valkey.env.example" "$VALKEY_ENV"
[ -f "$API_INFRA_ENV" ] || cp apps/api/.env.example "$API_INFRA_ENV"
[ -f "$WEB_INFRA_ENV" ] || cp apps/web/.env.example "$WEB_INFRA_ENV"
[ -f "$MANAGEMENT_API_INFRA_ENV" ] || cp apps/management-api/.env.example "$MANAGEMENT_API_INFRA_ENV"
[ -f "$MANAGEMENT_WEB_INFRA_ENV" ] || cp apps/management-web/.env.example "$MANAGEMENT_WEB_INFRA_ENV"
[ -f "$API_APP_ENV" ] || cp apps/api/.env.example "$API_APP_ENV"
[ -f "$WEB_APP_ENV" ] || cp apps/web/.env.example "$WEB_APP_ENV"
[ -f "$MANAGEMENT_API_APP_ENV" ] || cp apps/management-api/.env.example "$MANAGEMENT_API_APP_ENV"
[ -f "$MANAGEMENT_WEB_APP_ENV" ] || cp apps/management-web/.env.example "$MANAGEMENT_WEB_APP_ENV"

# Generate secrets and set host/Docker defaults (idempotent)
bash scripts/env-setup-secrets.sh

# Helpers for applying override values (Podverse-style)
escape_sed_replacement() {
  printf '%s' "$1" | sed -e 's/[\/&]/\\&/g'
}

trim_quotes() {
  local value="$1"
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  printf '%s' "$value"
}

get_var() {
  local file="$1" var="$2" line
  [ -f "$file" ] || return 0
  line="$(grep -E "^${var}=" "$file" 2>/dev/null | head -n 1 || true)"
  [ -n "$line" ] || return 0
  trim_quotes "${line#*=}"
}

upsert_var() {
  local file="$1" var="$2" value="${3-}" replacement
  [ -f "$file" ] || return 0
  if [ -z "$value" ]; then
    replacement="${var}="
  else
    replacement="${var}=\"$(escape_sed_replacement "$value")\""
  fi
  if grep -q -E "^${var}=" "$file" 2>/dev/null; then
    sed -i.bak "s|^${var}=.*|${replacement}|" "$file"
    rm -f "${file}.bak"
  else
    echo "$replacement" >>"$file"
  fi
}

load_overrides() {
  if [ -d "$OVERRIDES_DIR" ]; then
    for file in "$OVERRIDES_DIR"/*.env; do
      [ -f "$file" ] || continue
      set -a
      # shellcheck disable=SC1090
      . "$file"
      set +a
    done
  fi
}

apply_override() {
  local var="$1"
  shift
  local value="${!var:-}"
  local file
  [ -n "$value" ] || return 0
  for file in "$@"; do
    upsert_var "$file" "$var" "$value"
  done
}

# Bootstrap override .env from .env.example when missing so sensible defaults apply without prepare/link
if [ -d "$OVERRIDES_DIR" ]; then
  for example_file in "$OVERRIDES_DIR"/*.env.example; do
    [ -f "$example_file" ] || continue
    base_name="${example_file##*/}"
    target_name="${base_name%.example}"
    env_file="$OVERRIDES_DIR/$target_name"
    if [ ! -f "$env_file" ] && [ ! -L "$env_file" ]; then
      cp "$example_file" "$env_file"
    fi
  done
fi

# Load override files (from home dir via symlink or in-repo)
load_overrides

# From management-superuser.env
apply_override "MANAGEMENT_SUPERUSER_EMAIL" "$DB_ENV"
apply_override "MANAGEMENT_SUPERUSER_PASSWORD" "$DB_ENV"

# From brand.env: API and management-api use BRAND_NAME
apply_override "BRAND_NAME" "$API_APP_ENV" "$API_INFRA_ENV" "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV"

# From brand.env: web gets NEXT_PUBLIC_BRAND_NAME from BRAND_NAME
if [ -n "${BRAND_NAME:-}" ]; then
  upsert_var "$WEB_APP_ENV" "NEXT_PUBLIC_BRAND_NAME" "$BRAND_NAME"
  upsert_var "$WEB_INFRA_ENV" "NEXT_PUBLIC_BRAND_NAME" "$BRAND_NAME"
fi

# From brand.env: management-web gets NEXT_PUBLIC_BRAND_NAME from MANAGEMENT_BRAND_NAME
if [ -n "${MANAGEMENT_BRAND_NAME:-}" ]; then
  upsert_var "$MANAGEMENT_WEB_APP_ENV" "NEXT_PUBLIC_BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
  upsert_var "$MANAGEMENT_WEB_INFRA_ENV" "NEXT_PUBLIC_BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
fi

# From brand.env: app title icon for web and management-web
if [ -n "${NEXT_PUBLIC_APP_TITLE_ICON:-}" ]; then
  upsert_var "$WEB_APP_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$WEB_INFRA_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$MANAGEMENT_WEB_APP_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$MANAGEMENT_WEB_INFRA_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
fi

# From mailer.env: API only (no defaults; devs bring their own; tests use mailpit)
apply_override "SMTP_HOST" "$API_APP_ENV" "$API_INFRA_ENV"
apply_override "SMTP_PORT" "$API_APP_ENV" "$API_INFRA_ENV"
apply_override "MAIL_FROM" "$API_APP_ENV" "$API_INFRA_ENV"
apply_override "SMTP_USER" "$API_APP_ENV" "$API_INFRA_ENV"
apply_override "SMTP_PASSWORD" "$API_APP_ENV" "$API_INFRA_ENV"
apply_override "SMTP_SECURE" "$API_APP_ENV" "$API_INFRA_ENV"

# From auth.env: API and management-api (sensible default in example)
apply_override "AUTH_MODE" "$API_APP_ENV" "$API_INFRA_ENV" "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV"

# From locale.env: all four apps (sensible defaults in example)
apply_override "DEFAULT_LOCALE" "$API_APP_ENV" "$API_INFRA_ENV" "$WEB_APP_ENV" "$WEB_INFRA_ENV" "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV" "$MANAGEMENT_WEB_APP_ENV" "$MANAGEMENT_WEB_INFRA_ENV"
apply_override "SUPPORTED_LOCALES" "$API_APP_ENV" "$API_INFRA_ENV" "$WEB_APP_ENV" "$WEB_INFRA_ENV" "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV" "$MANAGEMENT_WEB_APP_ENV" "$MANAGEMENT_WEB_INFRA_ENV"

echo "Applied local env values from generated defaults and overrides."
