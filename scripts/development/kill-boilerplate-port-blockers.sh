#!/bin/bash
# Kill processes listening on common Boilerplate local-dev ports,
# plus any supervisor processes (nodemon, next dev, storybook, concurrently)
# that would immediately respawn new listeners on those ports.
# Run from anywhere; script resolves repo root automatically.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

DEFAULT_PORTS=(4000 4001 4002 4100 4101 4102 5433 6380 4050 6006)
DRY_RUN=0

print_usage() {
  cat <<'EOF'
Usage:
  bash scripts/development/kill-boilerplate-port-blockers.sh [--dry-run] [--ports "4000 4001 5433"]

Options:
  --dry-run          Print matching listeners without killing.
  --ports "<list>"   Space-delimited port list; overrides defaults.
  -h, --help         Show this help text.
EOF
}

PORTS=("${DEFAULT_PORTS[@]}")
while [ "$#" -gt 0 ]; do
  case "$1" in
  --dry-run)
    DRY_RUN=1
    shift
    ;;
  --ports)
    shift
    if [ "$#" -eq 0 ]; then
      echo "Error: --ports requires a value." >&2
      exit 1
    fi
    # shellcheck disable=SC2206
    PORTS=($1)
    shift
    ;;
  -h | --help)
    print_usage
    exit 0
    ;;
  *)
    echo "Error: Unknown option '$1'." >&2
    print_usage
    exit 1
    ;;
  esac
done

if ! command -v lsof >/dev/null 2>&1; then
  echo "Error: lsof is required." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Phase 1: find listener PIDs on target ports
# ---------------------------------------------------------------------------
echo "Checking Boilerplate ports: ${PORTS[*]}"

PIDS_TO_KILL=()
for port in "${PORTS[@]}"; do
  if ! [[ "$port" =~ ^[0-9]+$ ]]; then
    echo "Skipping invalid port: $port"
    continue
  fi

  pids_raw="$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)"
  if [ -z "$pids_raw" ]; then
    continue
  fi

  while IFS= read -r pid; do
    if [ -z "$pid" ]; then
      continue
    fi
    echo "Port $port -> PID $pid (listener)"
    PIDS_TO_KILL+=("$pid")
  done <<EOF
$pids_raw
EOF
done

# ---------------------------------------------------------------------------
# Phase 2: find supervisor PIDs that would respawn listeners
# Targets: nodemon, next dev, storybook dev, and concurrently instances
# that reference Boilerplate repo paths.
# ---------------------------------------------------------------------------
SUPERVISOR_PATTERNS=(
  "nodemon"
  "next dev --webpack"
  "storybook dev -p"
  "boilerplate/apps"
  "boilerplate/packages"
)

if command -v pgrep >/dev/null 2>&1; then
  for pattern in "${SUPERVISOR_PATTERNS[@]}"; do
    sup_pids_raw="$(pgrep -f "$pattern" 2>/dev/null || true)"
    if [ -z "$sup_pids_raw" ]; then
      continue
    fi
    while IFS= read -r pid; do
      if [ -z "$pid" ]; then
        continue
      fi
      # Skip our own PID and parent shell
      if [ "$pid" -eq "$$" ] 2>/dev/null || [ "$pid" -eq "$PPID" ] 2>/dev/null; then
        continue
      fi
      echo "Supervisor -> PID $pid (pattern: $pattern)"
      PIDS_TO_KILL+=("$pid")
    done <<EOF
$sup_pids_raw
EOF
  done
fi

if [ "${#PIDS_TO_KILL[@]}" -eq 0 ]; then
  echo "No blocking listeners or supervisors found."
  exit 0
fi

# Unique PIDs
UNIQUE_PIDS=()
while IFS= read -r unique_pid; do
  if [ -n "$unique_pid" ]; then
    UNIQUE_PIDS+=("$unique_pid")
  fi
done <<EOF
$(printf '%s\n' "${PIDS_TO_KILL[@]}" | awk '!seen[$0]++')
EOF

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Dry run enabled; no processes were killed."
  exit 0
fi

# ---------------------------------------------------------------------------
# Phase 3: send SIGTERM, then SIGKILL for survivors
# ---------------------------------------------------------------------------
echo "Sending SIGTERM to PIDs: ${UNIQUE_PIDS[*]}"
for pid in "${UNIQUE_PIDS[@]}"; do
  kill -TERM "$pid" 2>/dev/null || true
done

sleep 1

REMAINING=()
for pid in "${UNIQUE_PIDS[@]}"; do
  if kill -0 "$pid" 2>/dev/null; then
    REMAINING+=("$pid")
  fi
done

if [ "${#REMAINING[@]}" -gt 0 ]; then
  echo "Sending SIGKILL to stubborn PIDs: ${REMAINING[*]}"
  for pid in "${REMAINING[@]}"; do
    kill -KILL "$pid" 2>/dev/null || true
  done
fi

# ---------------------------------------------------------------------------
# Phase 4: verify all target ports are actually free (10-second timeout)
# ---------------------------------------------------------------------------
echo "Verifying ports are free..."
MAX_WAIT=10
ELAPSED=0
ALL_FREE=0
while [ "$ELAPSED" -lt "$MAX_WAIT" ]; do
  STILL_BLOCKED=()
  for port in "${PORTS[@]}"; do
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
      continue
    fi
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
      STILL_BLOCKED+=("$port")
    fi
  done

  if [ "${#STILL_BLOCKED[@]}" -eq 0 ]; then
    ALL_FREE=1
    break
  fi

  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

if [ "$ALL_FREE" -eq 1 ]; then
  echo "All target ports are free. Safe to run dev:all:watch."
else
  echo "Warning: these ports still have listeners after ${MAX_WAIT}s: ${STILL_BLOCKED[*]}"
  echo "Run with --dry-run to inspect them."
  exit 1
fi
