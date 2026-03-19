#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"

CLUSTER_NAME="${K3D_CLUSTER_NAME:-boilerplate-local}"

bash scripts/local-env/setup.sh
bash scripts/infra/k3d/build-images.sh

if ! k3d cluster list "$CLUSTER_NAME" >/dev/null 2>&1; then
  k3d cluster create "$CLUSTER_NAME" \
    --agents 1 \
    --servers 1 \
    --port "4000:4000@loadbalancer" \
    --port "4002:4002@loadbalancer" \
    --port "4100:4100@loadbalancer" \
    --port "4102:4102@loadbalancer" \
    --port "5433:5432@loadbalancer" \
    --port "6380:6379@loadbalancer"
fi

kubectl config use-context "k3d-$CLUSTER_NAME" >/dev/null

k3d image import -c "$CLUSTER_NAME" boilerplate-local-api:latest
k3d image import -c "$CLUSTER_NAME" boilerplate-local-management-api:latest
k3d image import -c "$CLUSTER_NAME" boilerplate-local-web-sidecar:latest
k3d image import -c "$CLUSTER_NAME" boilerplate-local-web:latest
k3d image import -c "$CLUSTER_NAME" boilerplate-local-management-web-sidecar:latest
k3d image import -c "$CLUSTER_NAME" boilerplate-local-management-web:latest

bash scripts/infra/k3d/create-local-secrets.sh
bash scripts/infra/argocd/install.sh
bash scripts/infra/argocd/bootstrap.sh

# Local fallback so the stack is runnable immediately even before remote repo sync is configured.
kubectl apply -k infra/k8s/local/stack

echo ""
echo "Local k3d + ArgoCD stack is up."
echo "API:             http://localhost:4000"
echo "Web:             http://localhost:4002"
echo "Management API:  http://localhost:4100"
echo "Management Web:  http://localhost:4102"
echo "Postgres:        localhost:5433"
echo "Valkey:          localhost:6380"
echo ""
echo "ArgoCD UI:"
echo "  kubectl -n argocd port-forward svc/argocd-server 8080:443"
echo "  open https://localhost:8080"
