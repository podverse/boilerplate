#!/bin/bash
# Combine numbered migrations into combined init SQL for both main and management DBs.
# Also copies the combined files into infra/k8s/base/stack/postgres-init/ so the k8s
# ConfigMap stays in sync (Kustomize requires files under the kustomization root).
# Edit migration files in infra/database/migrations/ and infra/management-database/migrations/;
# do not edit the generated combined files by hand.
#
# Usage: ./scripts/database/combine-migrations.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Main database: infra/database/migrations -> infra/database/combined/init_database.sql
MIGRATIONS_DB="$REPO_ROOT/infra/database/migrations"
COMBINED_DB="$REPO_ROOT/infra/database/combined/init_database.sql"

echo "Combining database migrations..."
echo "-- Combined migrations generated $(date)" > "$COMBINED_DB"
echo "-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh" >> "$COMBINED_DB"
echo "" >> "$COMBINED_DB"

for migration in $(ls "$MIGRATIONS_DB"/*.sql 2>/dev/null | sort); do
  echo "-- Including: $(basename "$migration")" >> "$COMBINED_DB"
  cat "$migration" >> "$COMBINED_DB"
  echo "" >> "$COMBINED_DB"
  echo "" >> "$COMBINED_DB"
done

echo "✓ Combined: $COMBINED_DB"

# Management database: infra/management-database/migrations -> infra/management-database/combined/init_management_database.sql
MIGRATIONS_MGMT="$REPO_ROOT/infra/management-database/migrations"
COMBINED_MGMT="$REPO_ROOT/infra/management-database/combined/init_management_database.sql"

mkdir -p "$(dirname "$COMBINED_MGMT")"

echo "Combining management-database migrations..."
echo "-- Combined migrations generated $(date)" > "$COMBINED_MGMT"
echo "-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh" >> "$COMBINED_MGMT"
echo "" >> "$COMBINED_MGMT"

for migration in $(ls "$MIGRATIONS_MGMT"/*.sql 2>/dev/null | sort); do
  echo "-- Including: $(basename "$migration")" >> "$COMBINED_MGMT"
  cat "$migration" >> "$COMBINED_MGMT"
  echo "" >> "$COMBINED_MGMT"
  echo "" >> "$COMBINED_MGMT"
done

echo "✓ Combined: $COMBINED_MGMT"

# Sync to k8s base stack so postgres-init ConfigMap stays in sync (same as make sync_k8s_postgres_init).
K8S_POSTGRES_INIT="$REPO_ROOT/infra/k8s/base/stack/postgres-init"
cp "$COMBINED_DB" "$K8S_POSTGRES_INIT/init_database.sql"
cp "$COMBINED_MGMT" "$K8S_POSTGRES_INIT/init_management_database.sql"
echo "✓ Synced to $K8S_POSTGRES_INIT"
