#!/usr/bin/env bash
# Symlink dev/env-overrides/<ENV>/*.env from ~/.config/boilerplate/<ENV>-env-overrides/
# Usage: link-k8s-env-overrides.sh --env alpha|beta|prod
#
# Override home root with BOILERPLATE_HOME_ENV_OVERRIDES_DIR

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

ENV_NAME=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      ENV_NAME="${2:-}"
      shift 2
      ;;
    -h | --help)
      echo "Usage: link-k8s-env-overrides.sh --env alpha|beta|prod"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$ENV_NAME" ]]; then
  echo "Error: --env is required" >&2
  exit 1
fi

EXAMPLES_DIR="dev/env-overrides/examples"
REPO_ENV_DIR="dev/env-overrides/${ENV_NAME}"

if [[ -n "${BOILERPLATE_HOME_ENV_OVERRIDES_DIR:-}" ]]; then
  HOME_OVERRIDES_RAW="$BOILERPLATE_HOME_ENV_OVERRIDES_DIR"
else
  HOME_OVERRIDES_RAW="${HOME:-}/.config/boilerplate/${ENV_NAME}-env-overrides"
fi

HOME_OVERRIDES_EXPANDED="${HOME_OVERRIDES_RAW/#\~/$HOME}"
mkdir -p "$HOME_OVERRIDES_EXPANDED"
HOME_OVERRIDES_DIR="$(cd "$HOME_OVERRIDES_EXPANDED" && pwd)"

if ! ls "$EXAMPLES_DIR"/*.env.example >/dev/null 2>&1; then
  echo "No override example files in $EXAMPLES_DIR. Run prepare-k8s-env-overrides.sh after adding examples under $EXAMPLES_DIR."
  exit 0
fi

mkdir -p "$REPO_ENV_DIR"

for example_file in "$EXAMPLES_DIR"/*.env.example; do
  [[ -f "$example_file" ]] || continue
  base_name="${example_file##*/}"
  target_name="${base_name%.example}"
  home_file="$HOME_OVERRIDES_DIR/$target_name"
  repo_file="$REPO_ENV_DIR/$target_name"

  if [[ ! -f "$home_file" ]]; then
    if [[ -f "$repo_file" ]] && [[ ! -L "$repo_file" ]]; then
      cp "$repo_file" "$home_file"
      echo "Created $home_file (from repo override)"
    else
      cp "$example_file" "$home_file"
      echo "Created $home_file (from example)"
    fi
  fi

  if [[ ! -e "$repo_file" ]]; then
    ln -s "$home_file" "$repo_file"
    echo "Linked $repo_file -> $home_file"
  fi
done

echo ""
echo "${ENV_NAME} overrides linked from $HOME_OVERRIDES_DIR"
