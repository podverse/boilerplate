#!/usr/bin/env bash
# Render ConfigMap + Secret YAML for Boilerplate K8s workloads.
# Usage: render-k8s-env.sh --env alpha|beta|prod [--output-repo PATH] [--dry-run] [--no-prune]
#
# When not using --dry-run, OUTPUT_REPO is required: pass --output-repo PATH or set BOILERPLATE_K8S_OUTPUT_REPO
# to the GitOps repo root (no implicit sibling or out/ default).
# Prune: by default, removes generator-owned ConfigMaps, plain Secrets, and deployment-secret-env.yaml patches.
# Use --no-prune to skip deletion. --dry-run never prunes or writes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# shellcheck source=k8s-env-render-manifest.inc.sh
source "$SCRIPT_DIR/k8s-env-render-manifest.inc.sh"

ENV_NAME=""
OUTPUT_REPO=""
DRY_RUN=0
PRUNE=1

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
    --no-prune)
      PRUNE=0
      shift
      ;;
    -h | --help)
      sed -n '1,15p' "$0"
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

render_one() {
  local group=$1
  local merged
  merged=$(mktemp)
  shopt -s nullglob
  local overrides=(dev/env-overrides/"${ENV_NAME}"/*.env)
  shopt -u nullglob

  local extra_args=()
  local f
  for f in "${overrides[@]}"; do
    extra_args+=(--extra-env "$f")
  done

  ruby "$REPO_ROOT/scripts/env-classification/boilerplate-env.rb" merge-env \
    --profile remote_k8s \
    --group "$group" \
    "${extra_args[@]}" >"$merged"

  export BOILERPLATE_ENV_PROFILE=remote_k8s

  local suffix odir
  suffix=$(workload_resource_suffix "$group")
  odir=$(overlay_dir_for_workload "$group")
  if [[ -z "$odir" ]]; then
    rm -f "$merged"
    return 0
  fi

  local dest_base cm_file
  cm_file=$(configmap_filename_for_workload "$group")

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "=== ConfigMap ${group}"
    ruby "$SCRIPT_DIR/render_k8s_env.rb" \
      --group "$group" \
      --merged-env "$merged" \
      --namespace "$NAMESPACE" \
      --environment "$ENV_NAME" \
      --resource-suffix "$suffix" \
      --emit configmap || true
    echo "=== Secret ${group}"
    ruby "$SCRIPT_DIR/render_k8s_env.rb" \
      --group "$group" \
      --merged-env "$merged" \
      --namespace "$NAMESPACE" \
      --environment "$ENV_NAME" \
      --resource-suffix "$suffix" \
      --emit secret || true
    echo "=== Secret env patch ${group}"
    ruby "$SCRIPT_DIR/render_k8s_env.rb" \
      --group "$group" \
      --merged-env "$merged" \
      --namespace "$NAMESPACE" \
      --environment "$ENV_NAME" \
      --resource-suffix "$suffix" \
      --emit secret-env-patch || true
    rm -f "$merged"
    return 0
  fi

  dest_base="${OUTPUT_REPO}/${OVERLAY}/${odir}"
  mkdir -p "$dest_base"
  mkdir -p "$PLAIN_SECRETS_DIR"

  set +e
  ruby "$SCRIPT_DIR/render_k8s_env.rb" \
    --group "$group" \
    --merged-env "$merged" \
    --namespace "$NAMESPACE" \
    --environment "$ENV_NAME" \
    --resource-suffix "$suffix" \
    --emit configmap >"${dest_base}/${cm_file}"
  cm_rc=$?
  set -e
  case $cm_rc in
    0) echo "Wrote ${dest_base}/${cm_file}" ;;
    3) echo "Skip env group ${group} (no_env_from)" ;;
    4) echo "Skip ConfigMap for ${group} (no config keys)" ;;
    *) echo "Error: configmap render failed for ${group} (exit $cm_rc)" >&2; rm -f "$merged"; exit 1 ;;
  esac
  if [[ $cm_rc -ne 0 ]]; then
    rm -f "${dest_base}/${cm_file}"
  fi

  set +e
  ruby "$SCRIPT_DIR/render_k8s_env.rb" \
    --group "$group" \
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
    4) echo "Skip Secret for ${group} (no secret keys)" ;;
    *) echo "Error: secret render failed for ${group} (exit $sec_rc)" >&2; rm -f "$merged"; exit 1 ;;
  esac
  if [[ $sec_rc -ne 0 ]]; then
    rm -f "${PLAIN_SECRETS_DIR}/boilerplate-${suffix}-secrets.yaml"
  fi

  set +e
  ruby "$SCRIPT_DIR/render_k8s_env.rb" \
    --group "$group" \
    --merged-env "$merged" \
    --namespace "$NAMESPACE" \
    --environment "$ENV_NAME" \
    --resource-suffix "$suffix" \
    --emit secret-env-patch >"${dest_base}/deployment-secret-env.yaml"
  patch_rc=$?
  set -e
  case $patch_rc in
    0) echo "Wrote ${dest_base}/deployment-secret-env.yaml" ;;
    3) : ;;
    4) echo "Skip secret-env patch for ${group} (no secret keys)" ;;
    *)
      echo "Error: secret-env-patch render failed for ${group} (exit $patch_rc)" >&2
      rm -f "$merged"
      exit 1
      ;;
  esac
  if [[ $patch_rc -ne 0 ]]; then
    rm -f "${dest_base}/deployment-secret-env.yaml"
  fi

  rm -f "$merged"
}

echo "ENV=${ENV_NAME} OUTPUT_REPO=${OUTPUT_REPO} NAMESPACE=${NAMESPACE}"

if [[ "$DRY_RUN" -eq 0 && "$PRUNE" -eq 1 ]]; then
  echo "Pruning generator-owned paths under ${OUTPUT_REPO}"
  while IFS= read -r rel; do
    rm -f "${OUTPUT_REPO}/${rel}"
  done < <(k8s_env_render_owned_paths_relative_to_output_repo "$ENV_NAME")
fi

render_one db
render_one valkey
render_one api
render_one web-sidecar
render_one management-api
render_one management-web-sidecar

echo "Render complete."
