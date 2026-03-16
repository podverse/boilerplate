#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

OVERRIDES_DIR="dev/env-overrides/local"

# Default: XDG-style path; override with BOILERPLATE_HOME_OVERRIDES_DIR
if [ -n "${BOILERPLATE_HOME_OVERRIDES_DIR:-}" ]; then
  HOME_OVERRIDES_RAW="$BOILERPLATE_HOME_OVERRIDES_DIR"
else
  HOME_OVERRIDES_RAW="${HOME:-}/.config/boilerplate/local-env-overrides"
fi

# Expand leading ~ to $HOME for override path
HOME_OVERRIDES_EXPANDED="${HOME_OVERRIDES_RAW/#\~/$HOME}"
# Create directory if needed, then resolve to absolute path so symlinks work from any cwd
mkdir -p "$HOME_OVERRIDES_EXPANDED"
HOME_OVERRIDES_DIR="$(cd "$HOME_OVERRIDES_EXPANDED" && pwd)"

if ! ls "$OVERRIDES_DIR"/*.env.example >/dev/null 2>&1; then
  echo "No override example files in $OVERRIDES_DIR. Secrets are auto-generated; prepare/link are optional."
  echo "Run make local_env_setup to generate env files."
  exit 0
fi

mkdir -p "$OVERRIDES_DIR"
mkdir -p "$HOME_OVERRIDES_DIR"

for example_file in "$OVERRIDES_DIR"/*.env.example; do
  [ -f "$example_file" ] || continue
  base_name="${example_file##*/}"
  target_name="${base_name%.example}"
  home_file="$HOME_OVERRIDES_DIR/$target_name"
  repo_file="$OVERRIDES_DIR/$target_name"

  # Bootstrap home file from example if missing; use repo's real override if present so secrets carry over
  if [ ! -f "$home_file" ]; then
    if [ -f "$repo_file" ] && [ ! -L "$repo_file" ]; then
      cp "$repo_file" "$home_file"
      echo "Created $home_file (from repo override)"
    else
      cp "$example_file" "$home_file"
      echo "Created $home_file (from example)"
    fi
  fi

  # Create symlink in repo only if repo file is missing (do not overwrite existing)
  if [ ! -e "$repo_file" ]; then
    ln -s "$home_file" "$repo_file"
    echo "Linked $repo_file -> $home_file"
  fi
done

echo ""
echo "Local overrides are linked from $HOME_OVERRIDES_DIR"
echo "Edit files there; they apply to this and all other work trees."
echo "Then run: make local_env_setup"
