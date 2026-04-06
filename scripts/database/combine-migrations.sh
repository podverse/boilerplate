#!/bin/bash
# Combine numbered migrations into combined init SQL committed under infra/k8s (single source of truth).
# Canonical outputs: infra/k8s/base/stack/postgres-init/z_load_app_schema.sql and
# z_load_management_schema.sql; a copy is synced to infra/k8s/base/db/postgres-init/ for Kustomize.
# Edit migration files in infra/database/migrations/ and infra/management-database/migrations/;
# do not edit the generated z_load_*.sql files by hand.
#
# Usage: ./scripts/database/combine-migrations.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

K8S_POSTGRES_INIT_STACK="$REPO_ROOT/infra/k8s/base/stack/postgres-init"
K8S_POSTGRES_INIT_DB="$REPO_ROOT/infra/k8s/base/db/postgres-init"
mkdir -p "$K8S_POSTGRES_INIT_STACK" "$K8S_POSTGRES_INIT_DB"

Z_LOAD_APP="$K8S_POSTGRES_INIT_STACK/z_load_app_schema.sql"
Z_LOAD_MGMT="$K8S_POSTGRES_INIT_STACK/z_load_management_schema.sql"

# Main database: infra/database/migrations -> k8s postgres-init
MIGRATIONS_DB="$REPO_ROOT/infra/database/migrations"

echo "Combining database migrations..."
echo "-- Combined migrations generated $(date)" > "$Z_LOAD_APP"
echo "-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh" >> "$Z_LOAD_APP"
echo "" >> "$Z_LOAD_APP"

for migration in $(ls "$MIGRATIONS_DB"/*.sql 2>/dev/null | sort); do
  echo "-- Including: $(basename "$migration")" >> "$Z_LOAD_APP"
  cat "$migration" >> "$Z_LOAD_APP"
  echo "" >> "$Z_LOAD_APP"
  echo "" >> "$Z_LOAD_APP"
done

echo "✓ Combined: $Z_LOAD_APP"

# Management database: infra/management-database/migrations -> k8s postgres-init
MIGRATIONS_MGMT="$REPO_ROOT/infra/management-database/migrations"

echo "Combining management-database migrations..."
echo "-- Combined migrations generated $(date)" > "$Z_LOAD_MGMT"
echo "-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh" >> "$Z_LOAD_MGMT"
echo "" >> "$Z_LOAD_MGMT"

for migration in $(ls "$MIGRATIONS_MGMT"/*.sql 2>/dev/null | sort); do
  echo "-- Including: $(basename "$migration")" >> "$Z_LOAD_MGMT"
  cat "$migration" >> "$Z_LOAD_MGMT"
  echo "" >> "$Z_LOAD_MGMT"
  echo "" >> "$Z_LOAD_MGMT"
done

echo "✓ Combined: $Z_LOAD_MGMT"

# Kustomize load restrictor: db base must read files under base/db/postgres-init/.
cp "$Z_LOAD_APP" "$K8S_POSTGRES_INIT_DB/z_load_app_schema.sql"
cp "$Z_LOAD_MGMT" "$K8S_POSTGRES_INIT_DB/z_load_management_schema.sql"
cp "$K8S_POSTGRES_INIT_STACK"/*.sh "$K8S_POSTGRES_INIT_DB/"
echo "✓ Synced SQL and shell scripts to $K8S_POSTGRES_INIT_DB"
