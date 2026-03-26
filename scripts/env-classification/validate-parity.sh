#!/usr/bin/env bash
# Smoke-test: classification YAML merges and boilerplate-env CLI for every workload/profile used in CI and local setup.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

bash scripts/k8s-env/validate-classification.sh

RUBY="${BOILERPLATE_ENV_RUBY:-ruby}"

profiles=(dev local_docker local_k8s remote_k8s)
workloads=(db valkey locale mailer auth info api web-sidecar web management-api management-web-sidecar management-web)

for profile in "${profiles[@]}"; do
  for workload in "${workloads[@]}"; do
    "$RUBY" scripts/env-classification/boilerplate-env.rb merge-env \
      --profile "$profile" \
      --workload "$workload" >/dev/null
  done
done

echo "validate-parity: OK"
