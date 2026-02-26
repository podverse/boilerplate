#!/bin/bash
# Combine numbered migrations into infra/database/combined/init_database.sql.
# Edit migration files in infra/database/migrations/ (e.g. 0000_init_helpers.sql);
# do not edit init_database.sql by hand.
#
# Usage: ./scripts/database/combine-migrations.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

MIGRATIONS="$REPO_ROOT/infra/database/migrations"
COMBINED="$REPO_ROOT/infra/database/combined/init_database.sql"

echo "Combining database migrations..."
echo "-- Combined migrations generated $(date)" > "$COMBINED"
echo "-- DO NOT EDIT - regenerate with scripts/database/combine-migrations.sh" >> "$COMBINED"
echo "" >> "$COMBINED"

for migration in $(ls "$MIGRATIONS"/*.sql 2>/dev/null | sort); do
  echo "-- Including: $(basename "$migration")" >> "$COMBINED"
  cat "$migration" >> "$COMBINED"
  echo "" >> "$COMBINED"
  echo "" >> "$COMBINED"
done

echo "✓ Combined: $COMBINED"
