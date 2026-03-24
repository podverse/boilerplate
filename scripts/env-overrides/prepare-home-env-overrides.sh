#!/usr/bin/env bash
# Seed ~/.config/boilerplate/.../*.env from dev/env-overrides/examples/*.env.example when missing.
# Invoked by prepare-local-env-overrides.sh (--profile local) or prepare-k8s-env-overrides.sh (--profile k8s --env <name>).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

EXAMPLES_DIR="dev/env-overrides/examples"

PROFILE=""
ENV_NAME=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      PROFILE="${2:-}"
      shift 2
      ;;
    --env)
      ENV_NAME="${2:-}"
      shift 2
      ;;
    -h | --help)
      echo "Usage: prepare-home-env-overrides.sh --profile local"
      echo "       prepare-home-env-overrides.sh --profile k8s --env alpha|beta|prod"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "$PROFILE" != "local" ]] && [[ "$PROFILE" != "k8s" ]]; then
  echo "Error: --profile local|k8s is required" >&2
  exit 1
fi

if [[ "$PROFILE" == "k8s" ]] && [[ -z "$ENV_NAME" ]]; then
  echo "Error: --env is required for --profile k8s" >&2
  exit 1
fi

if [[ "$PROFILE" == "local" ]]; then
  if [[ -n "${BOILERPLATE_HOME_OVERRIDES_DIR:-}" ]]; then
    HOME_OVERRIDES_RAW="$BOILERPLATE_HOME_OVERRIDES_DIR"
  else
    HOME_OVERRIDES_RAW="${HOME:-}/.config/boilerplate/local-env-overrides"
  fi
else
  if [[ -n "${BOILERPLATE_HOME_ENV_OVERRIDES_DIR:-}" ]]; then
    HOME_OVERRIDES_RAW="$BOILERPLATE_HOME_ENV_OVERRIDES_DIR"
  else
    HOME_OVERRIDES_RAW="${HOME:-}/.config/boilerplate/${ENV_NAME}-env-overrides"
  fi
fi

HOME_OVERRIDES_EXPANDED="${HOME_OVERRIDES_RAW/#\~/$HOME}"
mkdir -p "$HOME_OVERRIDES_EXPANDED"
HOME_OVERRIDES_DIR="$(cd "$HOME_OVERRIDES_EXPANDED" && pwd)"

if ! ls "$EXAMPLES_DIR"/*.env.example >/dev/null 2>&1; then
  if [[ "$PROFILE" == "local" ]]; then
    echo "No override example files in $EXAMPLES_DIR. Secrets are auto-generated; prepare/link are optional."
    echo "Run make local_env_setup to generate env files."
  else
    echo "No *.env.example files in $EXAMPLES_DIR. Add examples first."
  fi
  exit 0
fi

for example_file in "$EXAMPLES_DIR"/*.env.example; do
  [[ -f "$example_file" ]] || continue
  base_name="${example_file##*/}"
  target_name="${base_name%.example}"
  home_file="$HOME_OVERRIDES_DIR/$target_name"
  if [[ ! -f "$home_file" ]]; then
    cp "$example_file" "$home_file"
    echo "Created $home_file"
  fi
done

if [[ "$PROFILE" == "local" ]]; then
  cat <<EOF

Override files are in $HOME_OVERRIDES_DIR.
Edit those files with your private or external values, then run:

  make local_env_link
  make local_env_setup

Link makes dev/env-overrides/local/*.env point at home; setup generates app and infra env from them.
EOF
else
  cat <<EOF

Override files are in $HOME_OVERRIDES_DIR.
Edit those values, then run:

  make k8s_env_link K8S_ENV=${ENV_NAME}

Link symlinks dev/env-overrides/${ENV_NAME}/*.env to home so render reads them.
EOF
fi
