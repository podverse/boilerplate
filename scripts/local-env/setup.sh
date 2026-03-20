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
WEB_SIDECAR_INFRA_ENV="infra/config/local/web-sidecar.env"
MANAGEMENT_API_INFRA_ENV="infra/config/local/management-api.env"
MANAGEMENT_WEB_INFRA_ENV="infra/config/local/management-web.env"
MANAGEMENT_WEB_SIDECAR_INFRA_ENV="infra/config/local/management-web-sidecar.env"
API_APP_ENV="apps/api/.env"
WEB_APP_ENV="apps/web/.env.local"
MANAGEMENT_API_APP_ENV="apps/management-api/.env"
MANAGEMENT_WEB_APP_ENV="apps/management-web/.env.local"

# Ensure all required env files exist (copy from templates/examples when missing)
mkdir -p infra/config/local
[ -f "$DB_ENV" ] || cp "$ENV_TEMPLATES/db.env.example" "$DB_ENV"
[ -f "$VALKEY_ENV" ] || cp "$ENV_TEMPLATES/valkey.env.example" "$VALKEY_ENV"
[ -f "$API_INFRA_ENV" ] || cp apps/api/.env.example "$API_INFRA_ENV"
[ -f "$WEB_INFRA_ENV" ] || cp "$ENV_TEMPLATES/web.env.example" "$WEB_INFRA_ENV"
[ -f "$WEB_SIDECAR_INFRA_ENV" ] || cp apps/web/sidecar/.env.example "$WEB_SIDECAR_INFRA_ENV"
[ -f "$MANAGEMENT_API_INFRA_ENV" ] || cp apps/management-api/.env.example "$MANAGEMENT_API_INFRA_ENV"
[ -f "$MANAGEMENT_WEB_INFRA_ENV" ] || cp "$ENV_TEMPLATES/management-web.env.example" "$MANAGEMENT_WEB_INFRA_ENV"
[ -f "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV" ] || cp apps/management-web/sidecar/.env.example "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV"
[ -f "$API_APP_ENV" ] || cp apps/api/.env.example "$API_APP_ENV"
[ -f "$WEB_APP_ENV" ] || cp apps/web/.env.example "$WEB_APP_ENV"
[ -f "$MANAGEMENT_API_APP_ENV" ] || cp apps/management-api/.env.example "$MANAGEMENT_API_APP_ENV"
[ -f "$MANAGEMENT_WEB_APP_ENV" ] || cp apps/management-web/.env.example "$MANAGEMENT_WEB_APP_ENV"

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

# Podverse-style: try get_var on each file:var; if any non-empty return it; else run generator.
first_non_empty_or_generate() {
  local generator="$1"
  shift
  local pair file var current
  for pair in "$@"; do
    file="${pair%%:*}"
    var="${pair#*:}"
    current="$(get_var "$file" "$var")"
    if [ -n "$current" ]; then
      printf '%s' "$current"
      return 0
    fi
  done
  "$generator"
}

generate_hex_32() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32 | tr -d '\n'
    return 0
  fi
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

generate_uuid() {
  if command -v uuidgen >/dev/null 2>&1; then
    uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '\n'
    return 0
  fi
  node -e "console.log(require('crypto').randomUUID())"
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

# Generate all secrets in setup.sh (Podverse-style: hex for passwords, UUID for JWT; reuse existing via first_non_empty_or_generate)
# API and management-api use different JWT secrets (so Podverse and Boilerplate each have distinct API vs management JWTs).
POSTGRES_PASSWORD="$(first_non_empty_or_generate generate_hex_32 "$DB_ENV:POSTGRES_PASSWORD")"
DB_READ_PASSWORD="$(first_non_empty_or_generate generate_hex_32 "$DB_ENV:DB_READ_PASSWORD")"
DB_READ_WRITE_PASSWORD="$(first_non_empty_or_generate generate_hex_32 "$DB_ENV:DB_READ_WRITE_PASSWORD")"
POSTGRES_MANAGEMENT_READ_PASSWORD="$(first_non_empty_or_generate generate_hex_32 "$DB_ENV:POSTGRES_MANAGEMENT_READ_PASSWORD")"
POSTGRES_MANAGEMENT_READ_WRITE_PASSWORD="$(first_non_empty_or_generate generate_hex_32 "$DB_ENV:POSTGRES_MANAGEMENT_READ_WRITE_PASSWORD")"
VALKEY_PASSWORD="$(first_non_empty_or_generate generate_hex_32 "$VALKEY_ENV:VALKEY_PASSWORD" "$API_INFRA_ENV:VALKEY_PASSWORD" "$API_APP_ENV:VALKEY_PASSWORD")"
JWT_SECRET="$(first_non_empty_or_generate generate_uuid "$API_INFRA_ENV:JWT_SECRET" "$API_APP_ENV:JWT_SECRET")"
MANAGEMENT_JWT_SECRET="$(first_non_empty_or_generate generate_uuid "$MANAGEMENT_API_INFRA_ENV:MANAGEMENT_JWT_SECRET" "$MANAGEMENT_API_APP_ENV:MANAGEMENT_JWT_SECRET")"

upsert_var "$DB_ENV" "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD"
upsert_var "$DB_ENV" "DB_READ_PASSWORD" "$DB_READ_PASSWORD"
upsert_var "$DB_ENV" "DB_READ_WRITE_PASSWORD" "$DB_READ_WRITE_PASSWORD"
upsert_var "$DB_ENV" "POSTGRES_MANAGEMENT_READ_PASSWORD" "$POSTGRES_MANAGEMENT_READ_PASSWORD"
upsert_var "$DB_ENV" "POSTGRES_MANAGEMENT_READ_WRITE_PASSWORD" "$POSTGRES_MANAGEMENT_READ_WRITE_PASSWORD"
upsert_var "$VALKEY_ENV" "VALKEY_PASSWORD" "$VALKEY_PASSWORD"

for f in "$API_APP_ENV" "$API_INFRA_ENV"; do
  upsert_var "$f" "JWT_SECRET" "$JWT_SECRET"
  upsert_var "$f" "DB_READ_PASSWORD" "$DB_READ_PASSWORD"
  upsert_var "$f" "DB_READ_WRITE_PASSWORD" "$DB_READ_WRITE_PASSWORD"
  upsert_var "$f" "VALKEY_PASSWORD" "$VALKEY_PASSWORD"
done
for f in "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV"; do
  upsert_var "$f" "MANAGEMENT_JWT_SECRET" "$MANAGEMENT_JWT_SECRET"
  upsert_var "$f" "DB_READ_PASSWORD" "$DB_READ_PASSWORD"
  upsert_var "$f" "DB_READ_WRITE_PASSWORD" "$DB_READ_WRITE_PASSWORD"
  upsert_var "$f" "MANAGEMENT_DB_PASSWORD" "$POSTGRES_MANAGEMENT_READ_WRITE_PASSWORD"
  upsert_var "$f" "VALKEY_PASSWORD" "$VALKEY_PASSWORD"
done

# Host connection defaults only (no secret generation)
bash scripts/env-setup-secrets.sh

# From management-superuser.env
apply_override "MANAGEMENT_SUPERUSER_EMAIL" "$DB_ENV"
apply_override "MANAGEMENT_SUPERUSER_PASSWORD" "$DB_ENV"

# From brand.env: api/web = BRAND_NAME; mgmt api/mgmt web = MANAGEMENT_BRAND_NAME. Do not set NEXT_PUBLIC_BRAND_NAME in overrides.
apply_override "BRAND_NAME" "$API_APP_ENV" "$API_INFRA_ENV"
if [ -n "${BRAND_NAME:-}" ]; then
  upsert_var "$WEB_APP_ENV" "NEXT_PUBLIC_BRAND_NAME" "$BRAND_NAME"
  upsert_var "$WEB_INFRA_ENV" "NEXT_PUBLIC_BRAND_NAME" "$BRAND_NAME"
  upsert_var "$WEB_SIDECAR_INFRA_ENV" "NEXT_PUBLIC_BRAND_NAME" "$BRAND_NAME"
fi
if [ -n "${MANAGEMENT_BRAND_NAME:-}" ]; then
  upsert_var "$MANAGEMENT_API_APP_ENV" "BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
  upsert_var "$MANAGEMENT_API_INFRA_ENV" "BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
  upsert_var "$MANAGEMENT_WEB_APP_ENV" "NEXT_PUBLIC_BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
  upsert_var "$MANAGEMENT_WEB_INFRA_ENV" "NEXT_PUBLIC_BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
  upsert_var "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV" "NEXT_PUBLIC_BRAND_NAME" "$MANAGEMENT_BRAND_NAME"
fi

# From brand.env: app title icon for web and management-web
if [ -n "${NEXT_PUBLIC_APP_TITLE_ICON:-}" ]; then
  upsert_var "$WEB_APP_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$WEB_INFRA_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$WEB_SIDECAR_INFRA_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$MANAGEMENT_WEB_APP_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$MANAGEMENT_WEB_INFRA_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
  upsert_var "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV" "NEXT_PUBLIC_APP_TITLE_ICON" "$NEXT_PUBLIC_APP_TITLE_ICON"
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

# From locale.env: API/management-api use DEFAULT_LOCALE and SUPPORTED_LOCALES; web/management-web (and sidecars) also get NEXT_PUBLIC_* for runtime config
apply_override "DEFAULT_LOCALE" "$API_APP_ENV" "$API_INFRA_ENV" "$WEB_APP_ENV" "$WEB_INFRA_ENV" "$WEB_SIDECAR_INFRA_ENV" "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV" "$MANAGEMENT_WEB_APP_ENV" "$MANAGEMENT_WEB_INFRA_ENV" "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV"
apply_override "SUPPORTED_LOCALES" "$API_APP_ENV" "$API_INFRA_ENV" "$WEB_APP_ENV" "$WEB_INFRA_ENV" "$WEB_SIDECAR_INFRA_ENV" "$MANAGEMENT_API_APP_ENV" "$MANAGEMENT_API_INFRA_ENV" "$MANAGEMENT_WEB_APP_ENV" "$MANAGEMENT_WEB_INFRA_ENV" "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV"
apply_override "NEXT_PUBLIC_DEFAULT_LOCALE" "$WEB_APP_ENV" "$WEB_INFRA_ENV" "$WEB_SIDECAR_INFRA_ENV" "$MANAGEMENT_WEB_APP_ENV" "$MANAGEMENT_WEB_INFRA_ENV" "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV"
apply_override "NEXT_PUBLIC_SUPPORTED_LOCALES" "$WEB_APP_ENV" "$WEB_INFRA_ENV" "$WEB_SIDECAR_INFRA_ENV" "$MANAGEMENT_WEB_APP_ENV" "$MANAGEMENT_WEB_INFRA_ENV" "$MANAGEMENT_WEB_SIDECAR_INFRA_ENV"

echo "Applied local env values from generated defaults and overrides."
