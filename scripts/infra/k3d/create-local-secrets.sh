#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"

NAMESPACE="${K8S_NAMESPACE:-boilerplate-local}"

# kubectl --from-env-file does NOT strip surrounding quotes from values.
# The repo convention uses double-quoted values (PORT="4001"), but kubectl
# would store the literal string "4001" (with quotes). This helper creates
# a temp copy with quotes stripped so the secret values are clean.
strip_quotes_env() {
  local src="$1"
  local tmp
  tmp=$(mktemp)
  sed -E 's/^([A-Za-z_][A-Za-z0-9_]*)="(.*)"/\1=\2/' "$src" > "$tmp"
  echo "$tmp"
}

create_secret() {
  local name="$1"
  local env_file="$2"
  local stripped
  stripped=$(strip_quotes_env "$env_file")
  kubectl -n "$NAMESPACE" create secret generic "$name" \
    --from-env-file="$stripped" \
    --dry-run=client -o yaml | kubectl apply -f -
  rm -f "$stripped"
}

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

create_secret boilerplate-db-env           infra/config/local/db.env
create_secret boilerplate-valkey-env       infra/config/local/valkey.env
create_secret boilerplate-api-env          infra/config/local/api.env
create_secret boilerplate-management-api-env infra/config/local/management-api.env
create_secret boilerplate-web-env          infra/config/local/web.env
create_secret boilerplate-web-sidecar-env  infra/config/local/web-sidecar.env
create_secret boilerplate-management-web-env infra/config/local/management-web.env
create_secret boilerplate-management-web-sidecar-env infra/config/local/management-web-sidecar.env

echo "Applied local Kubernetes secrets from infra/config/local/*.env"
