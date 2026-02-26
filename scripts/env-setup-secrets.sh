#!/usr/bin/env bash
# Generate and assign all required passwords/secrets into env files.
# Run from repo root after env_setup has copied templates. Idempotent: skips vars that are already set.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT" || exit 1

generate_secret() {
  for openssl_cmd in openssl /usr/bin/openssl; do
    if command -v "$openssl_cmd" >/dev/null 2>&1 && secret=$("$openssl_cmd" rand -base64 32 2>/dev/null) && [ -n "$secret" ] && [ "${#secret}" -ge 32 ]; then
      echo "$secret"
      return 0
    fi
  done
  if command -v node >/dev/null 2>&1; then
    secret=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))" 2>/dev/null)
    if [ -n "$secret" ] && [ "${#secret}" -ge 32 ]; then
      echo "$secret"
      return 0
    fi
  fi
  echo "env-setup-secrets: could not generate secret (need openssl or node)" >&2
  return 1
}

# Returns 0 if var is empty or unset in file
is_var_empty() {
  local file="$1"
  local var="$2"
  [ ! -f "$file" ] && return 0
  local line
  line=$(grep -E "^${var}=" "$file" 2>/dev/null || true)
  [ -z "$line" ] && return 0
  local value
  value=$(echo "$line" | sed "s/^${var}=//" | tr -d '"' | tr -d "'")
  [ -z "$value" ] && return 0
  return 1
}

# Set VAR="value" in file only if currently empty. Portable sed.
set_var_if_empty() {
  local file="$1"
  local var="$2"
  local value="$3"
  [ ! -f "$file" ] && return 0
  if ! is_var_empty "$file" "$var"; then
    return 0
  fi
  if grep -q "^${var}=" "$file" 2>/dev/null; then
    # BSD and GNU sed: -i.bak then remove .bak
    sed -i.bak "s|^${var}=.*|${var}=\"${value}\"|" "$file"
    rm -f "${file}.bak"
  else
    echo "${var}=\"${value}\"" >> "$file"
  fi
  echo "Set ${var} in $file"
}

# Generate all secrets once
POSTGRES_PASSWORD=$(generate_secret) || exit 1
DB_READ_PASSWORD=$(generate_secret) || exit 1
DB_READ_WRITE_PASSWORD=$(generate_secret) || exit 1
VALKEY_PASSWORD=$(generate_secret) || exit 1
JWT_SECRET=$(generate_secret) || exit 1

DB_ENV="infra/config/local/db.env"
VALKEY_ENV="infra/config/local/valkey.env"
API_ENV="infra/config/local/api.env"
API_DOT_ENV="apps/api/.env"

# db.env: one set of names (DB_READ_*, DB_READ_WRITE_*) for init script and API/ORM
for f in "$DB_ENV"; do
  [ -f "$f" ] || continue
  set_var_if_empty "$f" "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD"
  set_var_if_empty "$f" "DB_READ_PASSWORD" "$DB_READ_PASSWORD"
  set_var_if_empty "$f" "DB_READ_WRITE_PASSWORD" "$DB_READ_WRITE_PASSWORD"
done

# valkey.env
[ -f "$VALKEY_ENV" ] && set_var_if_empty "$VALKEY_ENV" "VALKEY_PASSWORD" "$VALKEY_PASSWORD"

# api.env and apps/api/.env: JWT, DB credentials, Valkey (must match db.env and valkey.env)
for f in "$API_ENV" "$API_DOT_ENV"; do
  [ -f "$f" ] || continue
  set_var_if_empty "$f" "JWT_SECRET" "$JWT_SECRET"
  set_var_if_empty "$f" "DB_READ_PASSWORD" "$DB_READ_PASSWORD"
  set_var_if_empty "$f" "DB_READ_WRITE_PASSWORD" "$DB_READ_WRITE_PASSWORD"
  set_var_if_empty "$f" "VALKEY_PASSWORD" "$VALKEY_PASSWORD"
done
