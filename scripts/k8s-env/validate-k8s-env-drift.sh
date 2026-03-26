#!/usr/bin/env bash
# Compare rendered ConfigMaps and deployment-secret-env.yaml patches to committed files in the GitOps output repo.
# Requires --output-repo PATH or BOILERPLATE_K8S_OUTPUT_REPO. Exits 1 if unset, overlay missing, or mismatch.
# Usage: validate-k8s-env-drift.sh [--env alpha|beta|prod] [--output-repo PATH]
#
# ConfigMap and secret-env patch paths match k8s-env-render-manifest.inc.sh (same as render-k8s-env.sh).
# Secret values are not compared (plain/ may be gitignored). Re-run render and commit
# ConfigMaps and deployment-secret-env.yaml when infra/env/classification or dev/env-overrides change.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# shellcheck source=k8s-env-render-manifest.inc.sh
source "$SCRIPT_DIR/k8s-env-render-manifest.inc.sh"

ENV_NAME="${K8S_ENV:-alpha}"
OUTPUT_REPO_CLI=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_NAME="${2:-}"
      shift 2
      ;;
    --output-repo)
      OUTPUT_REPO_CLI="${2:-}"
      shift 2
      ;;
    -h | --help)
      sed -n '1,10p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$ENV_NAME" ]]; then
  echo "Error: --env cannot be empty" >&2
  exit 1
fi

if [[ -n "$OUTPUT_REPO_CLI" ]]; then
  OUTPUT_REPO="$(cd "$OUTPUT_REPO_CLI" && pwd)"
elif [[ -n "${BOILERPLATE_K8S_OUTPUT_REPO:-}" ]]; then
  OUTPUT_REPO="$(cd "$BOILERPLATE_K8S_OUTPUT_REPO" && pwd)"
else
  echo "validate-k8s-env-drift: Error: set BOILERPLATE_K8S_OUTPUT_REPO or pass --output-repo (path to GitOps repo root)." >&2
  exit 1
fi

OVERLAY="apps/boilerplate-${ENV_NAME}"
COMPARE_ROOT="${OUTPUT_REPO}/${OVERLAY}"

if [[ ! -d "$COMPARE_ROOT" ]]; then
  echo "validate-k8s-env-drift: Error: missing overlay directory ${COMPARE_ROOT}" >&2
  exit 1
fi

if ! command -v ruby >/dev/null 2>&1; then
  echo "Error: ruby is required for render." >&2
  exit 1
fi

TMP="$(mktemp -d)"
RENDER_LOG="$(mktemp)"
trap 'rm -rf "$TMP" "$RENDER_LOG"' EXIT

if ! bash "$SCRIPT_DIR/render-k8s-env.sh" --env "$ENV_NAME" --output-repo "$TMP" >"$RENDER_LOG" 2>&1; then
  cat "$RENDER_LOG" >&2
  exit 1
fi
rm -f "$RENDER_LOG"

mapfile -t cm_files < <(k8s_env_render_configmap_relpaths_under_overlay "$ENV_NAME")

failed=0
for rel in "${cm_files[@]}"; do
  left="${TMP}/${OVERLAY}/${rel}"
  right="${COMPARE_ROOT}/${rel}"
  if [[ ! -f "$left" && ! -f "$right" ]]; then
    continue
  fi
  if [[ ! -f "$right" ]]; then
    echo "validate-k8s-env-drift: missing committed file ${right}" >&2
    failed=1
    continue
  fi
  if [[ ! -f "$left" ]]; then
    echo "validate-k8s-env-drift: render did not produce ${left}" >&2
    failed=1
    continue
  fi
  if ! cmp -s "$left" "$right"; then
    echo "validate-k8s-env-drift: mismatch ${OVERLAY}/${rel}" >&2
    diff -u "$right" "$left" >&2 || true
    failed=1
  fi
done

mapfile -t patch_files < <(k8s_env_render_deployment_secret_patch_relpaths_under_overlay "$ENV_NAME")

for rel in "${patch_files[@]}"; do
  left="${TMP}/${OVERLAY}/${rel}"
  right="${COMPARE_ROOT}/${rel}"
  if [[ ! -f "$left" && ! -f "$right" ]]; then
    continue
  fi
  if [[ ! -f "$right" ]]; then
    echo "validate-k8s-env-drift: missing committed file ${right}" >&2
    failed=1
    continue
  fi
  if [[ ! -f "$left" ]]; then
    echo "validate-k8s-env-drift: render did not produce ${left} (remove stale ${right}?)" >&2
    failed=1
    continue
  fi
  if ! cmp -s "$left" "$right"; then
    echo "validate-k8s-env-drift: mismatch ${OVERLAY}/${rel}" >&2
    diff -u "$right" "$left" >&2 || true
    failed=1
  fi
done

if [[ "$failed" -ne 0 ]]; then
  echo "validate-k8s-env-drift: FAILED — run \`make alpha_env_render\` (or \`make k8s_env_render K8S_ENV=${ENV_NAME}\`) and commit ConfigMaps and deployment-secret-env.yaml in the output repo." >&2
  exit 1
fi

echo "validate-k8s-env-drift: OK (${ENV_NAME} vs ${OUTPUT_REPO})"
