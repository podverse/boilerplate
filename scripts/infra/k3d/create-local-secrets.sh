#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"

NAMESPACE="${K8S_NAMESPACE:-boilerplate-local}"

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-db-env \
  --from-env-file=infra/config/local/db.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-valkey-env \
  --from-env-file=infra/config/local/valkey.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-api-env \
  --from-env-file=infra/config/local/api.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-management-api-env \
  --from-env-file=infra/config/local/management-api.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-web-env \
  --from-env-file=infra/config/local/web.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-web-sidecar-env \
  --from-env-file=infra/config/local/web-sidecar.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-management-web-env \
  --from-env-file=infra/config/local/management-web.env \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n "$NAMESPACE" create secret generic boilerplate-management-web-sidecar-env \
  --from-env-file=infra/config/local/management-web-sidecar.env \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Applied local Kubernetes secrets from infra/config/local/*.env"
