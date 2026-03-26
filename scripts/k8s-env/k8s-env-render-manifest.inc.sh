#!/usr/bin/env bash
# Shared definitions for K8s env render: workload helpers and owned output paths.
# Source from render-k8s-env.sh and validate-k8s-env-drift.sh (do not execute directly).

workload_resource_suffix() {
  echo "$1"
}

overlay_dir_for_workload() {
  case "$1" in
    api) echo api ;;
    management-api) echo management-api ;;
    web-sidecar) echo web ;;
    management-web-sidecar) echo management-web ;;
    db) echo db ;;
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

# Order must match render-k8s-env.sh render_one sequence.
K8S_ENV_RENDER_WORKLOADS=(
  db
  valkey
  api
  web-sidecar
  management-api
  management-web-sidecar
)

overlay_root_for_env() {
  echo "apps/boilerplate-${1}"
}

# ConfigMap paths relative to apps/boilerplate-<env>/ (used by drift validation).
k8s_env_render_configmap_relpaths_under_overlay() {
  local env_name="$1"
  local odir cm_file w
  for w in "${K8S_ENV_RENDER_WORKLOADS[@]}"; do
    odir=$(overlay_dir_for_workload "$w")
    if [[ -z "$odir" ]]; then
      continue
    fi
    cm_file=$(configmap_filename_for_workload "$w")
    echo "${odir}/${cm_file}"
  done
}

# deployment-secret-env.yaml paths under apps/boilerplate-<env>/ (drift validation).
k8s_env_render_deployment_secret_patch_relpaths_under_overlay() {
  local odir w
  for w in "${K8S_ENV_RENDER_WORKLOADS[@]}"; do
    odir=$(overlay_dir_for_workload "$w")
    if [[ -z "$odir" ]]; then
      continue
    fi
    echo "${odir}/deployment-secret-env.yaml"
  done
}

# All generator-owned paths relative to GitOps repo root (ConfigMaps + plain Secrets + secret env patches).
k8s_env_render_owned_paths_relative_to_output_repo() {
  local env_name="$1"
  local oroot odir cm_file suffix w
  oroot=$(overlay_root_for_env "$env_name")
  for w in "${K8S_ENV_RENDER_WORKLOADS[@]}"; do
    odir=$(overlay_dir_for_workload "$w")
    if [[ -z "$odir" ]]; then
      continue
    fi
    cm_file=$(configmap_filename_for_workload "$w")
    echo "${oroot}/${odir}/${cm_file}"
    echo "${oroot}/${odir}/deployment-secret-env.yaml"
    suffix=$(workload_resource_suffix "$w")
    echo "secrets/boilerplate-${env_name}/plain/boilerplate-${suffix}-secrets.yaml"
  done
}
