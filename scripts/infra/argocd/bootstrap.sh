#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$REPO_ROOT"

kubectl apply -f infra/k8s/argocd-project.yaml
kubectl apply -f infra/k8s/local-application.yaml

echo "Applied ArgoCD AppProject and local app-of-apps root application."
