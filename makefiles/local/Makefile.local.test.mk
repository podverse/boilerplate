# --- Test requirements (local). Ports 5532 (Postgres) and 6479 (Valkey) avoid conflict with Podverse (5432, 6379). ---

.PHONY: test_deps test_postgres_up test_valkey_up test_db_init help_test test_check test_clean

# Default test ports (must match apps/api/src/test/setup.ts defaults)
TEST_DB_PORT ?= 5532
TEST_VALKEY_PORT ?= 6479
TEST_PG_USER ?= postgres
TEST_PG_PASSWORD ?= postgres
TEST_DB_NAME ?= boilerplate_test

TEST_PG_CONTAINER := boilerplate_test_postgres
TEST_VALKEY_CONTAINER := boilerplate_test_valkey

# Ensure Postgres and Valkey are running on test ports and boilerplate_test DB exists. Run this before npm run test.
test_deps: test_postgres_up test_valkey_up test_db_init

# Start Postgres on port $(TEST_DB_PORT) for tests (idempotent).
test_postgres_up:
	@if docker ps -q -f name=^/$(TEST_PG_CONTAINER)$$ | grep -q .; then \
		echo "Test Postgres already running ($(TEST_PG_CONTAINER))."; \
	elif docker ps -aq -f name=^/$(TEST_PG_CONTAINER)$$ | grep -q .; then \
		echo "Starting existing test Postgres container..."; \
		docker start $(TEST_PG_CONTAINER); \
		echo "Waiting for Postgres to be ready..."; \
		for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do \
			if docker exec $(TEST_PG_CONTAINER) pg_isready -U $(TEST_PG_USER) >/dev/null 2>&1; then break; fi; \
			sleep 1; \
			if [ $$i -eq 20 ]; then echo "Postgres did not become ready (run: docker logs $(TEST_PG_CONTAINER))."; exit 1; fi; \
		done; \
		echo "Test Postgres ready on port $(TEST_DB_PORT)."; \
	else \
		echo "Starting test Postgres on port $(TEST_DB_PORT)..."; \
		docker run -d --name $(TEST_PG_CONTAINER) \
			-p 127.0.0.1:$(TEST_DB_PORT):5432 \
			-e POSTGRES_USER=$(TEST_PG_USER) \
			-e POSTGRES_PASSWORD=$(TEST_PG_PASSWORD) \
			postgres:18.1; \
		echo "Waiting for Postgres to be ready..."; \
		for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do \
			if docker exec $(TEST_PG_CONTAINER) pg_isready -U $(TEST_PG_USER) >/dev/null 2>&1; then break; fi; \
			sleep 1; \
			if [ $$i -eq 20 ]; then echo "Postgres did not become ready (run: docker logs $(TEST_PG_CONTAINER))."; exit 1; fi; \
		done; \
		echo "Test Postgres ready on port $(TEST_DB_PORT)."; \
	fi

# Start Valkey on port $(TEST_VALKEY_PORT) for tests (idempotent).
test_valkey_up:
	@if docker ps -q -f name=^/$(TEST_VALKEY_CONTAINER)$$ | grep -q .; then \
		echo "Test Valkey already running ($(TEST_VALKEY_CONTAINER))."; \
	else \
		echo "Starting test Valkey on port $(TEST_VALKEY_PORT)..."; \
		docker run -d --name $(TEST_VALKEY_CONTAINER) \
			-p 127.0.0.1:$(TEST_VALKEY_PORT):6379 \
			valkey/valkey:7-alpine; \
		echo "Waiting for Valkey to be ready..."; \
		for i in 1 2 3 4 5; do \
			if (echo "PING" | nc -w 1 127.0.0.1 $(TEST_VALKEY_PORT) | grep -q PONG) 2>/dev/null || true; then break; fi; \
			sleep 1; \
		done; \
		echo "Test Valkey ready on port $(TEST_VALKEY_PORT)."; \
	fi

# Create boilerplate_test database, apply schema, create read/read_write users and grants. Requires test Postgres running.
# Drops and recreates the test DB each time so the schema always matches infra/database/combined/init_database.sql.
# Uses docker exec so host does not need psql installed.
test_db_init: test_postgres_up
	@echo "Creating test database and users..."
	@docker exec $(TEST_PG_CONTAINER) psql -U $(TEST_PG_USER) -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$(TEST_DB_NAME)' AND pid <> pg_backend_pid();" 2>/dev/null || true
	@docker exec $(TEST_PG_CONTAINER) psql -U $(TEST_PG_USER) -d postgres -c "DROP DATABASE IF EXISTS $(TEST_DB_NAME);"
	@docker exec $(TEST_PG_CONTAINER) psql -U $(TEST_PG_USER) -d postgres -c "CREATE DATABASE $(TEST_DB_NAME);"
	@cat infra/database/combined/init_database.sql | docker exec -i $(TEST_PG_CONTAINER) psql -U $(TEST_PG_USER) -d $(TEST_DB_NAME)
	@docker exec $(TEST_PG_CONTAINER) psql -U $(TEST_PG_USER) -d postgres -c "DO \$$$$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'read') THEN CREATE USER read WITH PASSWORD 'test'; END IF; IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'read_write') THEN CREATE USER read_write WITH PASSWORD 'test'; END IF; END \$$$$;"
	@docker exec $(TEST_PG_CONTAINER) psql -U $(TEST_PG_USER) -d $(TEST_DB_NAME) -c " \
		GRANT CONNECT ON DATABASE $(TEST_DB_NAME) TO read, read_write; \
		GRANT USAGE ON SCHEMA public TO read, read_write; \
		GRANT SELECT ON ALL TABLES IN SCHEMA public TO read; \
		GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO read; \
		GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public TO read_write; \
		GRANT SELECT, USAGE, UPDATE ON ALL SEQUENCES IN SCHEMA public TO read_write; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO read; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO read; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO read_write; \
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, USAGE, UPDATE ON SEQUENCES TO read_write;"
	@echo "Test database $(TEST_DB_NAME) and users ready."

# Stop and remove test Postgres and Valkey containers (and their volumes). Idempotent.
test_clean:
	@docker rm -f $(TEST_PG_CONTAINER) 2>/dev/null || true
	@docker rm -f $(TEST_VALKEY_CONTAINER) 2>/dev/null || true
	@echo "Test containers removed."

# Print instructions for meeting test requirements.
help_test:
	@echo "Test requirements: Postgres on port $(TEST_DB_PORT) and Valkey on port $(TEST_VALKEY_PORT), with database $(TEST_DB_NAME) and read/read_write users."
	@echo ""
	@echo "From repo root, run:"
	@echo "  make test_deps"
	@echo ""
	@echo "This will:"
	@echo "  1. Start Postgres in a container on port $(TEST_DB_PORT) (if not already running)."
	@echo "  2. Start Valkey in a container on port $(TEST_VALKEY_PORT) (if not already running)."
	@echo "  3. Drop and recreate $(TEST_DB_NAME), apply infra/database/combined/init_database.sql, and create read/read_write users."
	@echo "     (Recreating ensures the test DB schema stays in sync with migrations.)"
	@echo ""
	@echo "Then run:  npm run test"
