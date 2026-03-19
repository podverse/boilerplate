#!/bin/bash
set -e

: "${DB_READ_PASSWORD:?Missing DB_READ_PASSWORD}"
: "${DB_READ_WRITE_PASSWORD:?Missing DB_READ_WRITE_PASSWORD}"
: "${POSTGRES_DB:?Missing POSTGRES_DB}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<SQL
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'read') THEN
        EXECUTE format('CREATE USER read WITH PASSWORD %L', '${DB_READ_PASSWORD}');
    END IF;
END
\$\$;

DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'read_write') THEN
        EXECUTE format('CREATE USER read_write WITH PASSWORD %L', '${DB_READ_WRITE_PASSWORD}');
    END IF;
END
\$\$;

GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO read, read_write;
SQL
