#!/usr/bin/env bash
# Render ConfigMap + Secret YAML for Boilerplate K8s workloads.
# Usage: render-k8s-env.sh --env alpha|beta|prod [--output-repo PATH] [--dry-run]
#
# When not using --dry-run, OUTPUT_REPO is required: pass --output-repo PATH or set BOILERPLATE_K8S_OUTPUT_REPO
# to the GitOps repo root (no implicit sibling or out/ default).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# shellcheck source=lib/env-merge.sh
source "$SCRIPT_DIR/lib/env-merge.sh"

ENV_NAME=""
OUTPUT_REPO=""
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_NAME="${2:-}"
      shift 2
      ;;
    --output-repo)
      OUTPUT_REPO="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h | --help)
      sed -n '1,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$ENV_NAME" ]]; then
  echo "Error: --env is required (alpha|beta|prod)" >&2
  exit 1
fi

if ! command -v ruby >/dev/null 2>&1; then
  echo "Error: ruby is required (uses stdlib YAML)." >&2
  exit 1
fi

if [[ -z "${OUTPUT_REPO:-}" && -n "${BOILERPLATE_K8S_OUTPUT_REPO:-}" ]]; then
  OUTPUT_REPO="$BOILERPLATE_K8S_OUTPUT_REPO"
fi

if [[ "$DRY_RUN" -eq 0 && -z "${OUTPUT_REPO:-}" ]]; then
  echo "Error: set BOILERPLATE_K8S_OUTPUT_REPO or pass --output-repo (absolute path to GitOps repo root)." >&2
  exit 1
fi

NAMESPACE="boilerplate-${ENV_NAME}"
OVERLAY="apps/boilerplate-${ENV_NAME}"
if [[ -n "${OUTPUT_REPO:-}" ]]; then
  SECRETS_DIR="${OUTPUT_REPO}/secrets/boilerplate-${ENV_NAME}"
  PLAIN_SECRETS_DIR="${SECRETS_DIR}/plain"
else
  SECRETS_DIR=""
  PLAIN_SECRETS_DIR=""
fi

workload_resource_suffix() {
  case "$1" in
    postgres) echo db ;;
    *) echo "$1" ;;
  esac
}

overlay_dir_for_workload() {
  case "$1" in
    api) echo api ;;
    management-api) echo management-api ;;
    web-sidecar) echo web ;;
    management-web-sidecar) echo management-web ;;
    postgres) echo db ;;
    valkey) echo keyvaldb ;;
    *) echo "" ;;
  esac
}

configmap_filename_for_workload() {
  case "$1" in
    web-sidecar) echo configmap-web-sidecar.yaml ;;
    management-web-sidecar) echo configmap-management-web-sidecar.yaml ;;
    *) echo configmap.yaml ;;
  esac
}

render_one() {
  local workload=$1
  shift
  local sources=("$@")
  local merged
  merged=$(mktemp)
  shopt -s nullglob
  local overrides=(dev/env-overrides/"${ENV_NAME}"/*.env)
  shopt -u nullglob
  merge_env_files "${sources[@]}" "${overrides[@]}" >"$merged"

  local suffix odir
  suffix=$(workload_resource_suffix "$workload")
  odir=$(overlay_dir_for_workload "$workload")
  if [[ -z "$odir" ]]; then
    rm -f "$merged"
    return 0
  fi

  local dest_base cm_file
  cm_file=$(configmap_filename_for_workload "$workload")

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "=== ConfigMap ${workload}"
    ruby "$SCRIPT_DIR/render_k8s_env.rb" \
      --workload "$workload" \
      --merged-env "$merged" \
      --namespace "$NAMESPACE" \
      --environment "$ENV_NAME" \
      --resource-suffix "$suffix" \
      --emit configmap || true
    echo "=== Secret ${workload}"
    ruby "$SCRIPT_DIR/render_k8s_env.rb" \
      --workload "$workload" \
      --merged-env "$merged" \
      --namespace "$NAMESPACE" \
      --environment "$ENV_NAME" \
      --resource-suffix "$suffix" \
      --emit secret || true
    rm -f "$merged"
    return 0
  fi

  dest_base="${OUTPUT_REPO}/${OVERLAY}/${odir}"
  mkdir -p "$dest_base"
  mkdir -p "$PLAIN_SECRETS_DIR"

  set +e
  ruby "$SCRIPT_DIR/render_k8s_env.rb" \
    --workload "$workload" \
    --merged-env "$merged" \
    --namespace "$NAMESPACE" \
    --environment "$ENV_NAME" \
    --resource-suffix "$suffix" \
    --emit configmap >"${dest_base}/${cm_file}"
  cm_rc=$?
  set -e
  case $cm_rc in
    0) echo "Wrote ${dest_base}/${cm_file}" ;;
    3) echo "Skip workload ${workload} (no_env_from)" ;;
    4) echo "Skip ConfigMap for ${workload} (no config keys)" ;;
    *) echo "Error: configmap render failed for ${workload} (exit $cm_rc)" >&2; rm -f "$merged"; exit 1 ;;
  esac
  if [[ $cm_rc -ne 0 ]]; then
    rm -f "${dest_base}/${cm_file}"
  fi

  set +e
  ruby "$SCRIPT_DIR/render_k8s_env.rb" \
    --workload "$workload" \
    --merged-env "$merged" \
    --namespace "$NAMESPACE" \
    --environment "$ENV_NAME" \
    --resource-suffix "$suffix" \
    --emit secret >"${PLAIN_SECRETS_DIR}/boilerplate-${suffix}-secrets.yaml"
  sec_rc=$?
  set -e
  case $sec_rc in
    0) echo "Wrote ${PLAIN_SECRETS_DIR}/boilerplate-${suffix}-secrets.yaml (encrypt with sops before commit)" ;;
    3) : ;;
    4) echo "Skip Secret for ${workload} (no secret keys)" ;;
    *) echo "Error: secret render failed for ${workload} (exit $sec_rc)" >&2; rm -f "$merged"; exit 1 ;;
  esac
  if [[ $sec_rc -ne 0 ]]; then
    rm -f "${PLAIN_SECRETS_DIR}/boilerplate-${suffix}-secrets.yaml"
  fi

  rm -f "$merged"
}

echo "ENV=${ENV_NAME} OUTPUT_REPO=${OUTPUT_REPO} NAMESPACE=${NAMESPACE}"

render_one api apps/api/.env.example
render_one management-api apps/management-api/.env.example
render_one web-sidecar apps/web/sidecar/.env.example
render_one management-web-sidecar apps/management-web/sidecar/.env.example
render_one postgres infra/config/env-templates/db.env.example
render_one valkey infra/config/env-templates/valkey.env.example

echo "Render complete."
