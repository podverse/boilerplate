.PHONY: local_k3d_up local_k3d_down local_argocd_port_forward local_k3d_status sync_k8s_postgres_init check_k8s_postgres_init_sync

# Sync postgres init SQL into k8s base stack so Kustomize (load restrictor) can read them. Run after changing canonical init SQL.
sync_k8s_postgres_init:
	cp infra/database/combined/init_database.sql infra/k8s/base/stack/postgres-init/init_database.sql
	cp infra/management-database/combined/init_management_database.sql infra/k8s/base/stack/postgres-init/init_management_database.sql

# Fail if canonical combined SQL and k8s postgres-init copies differ (catches manual edits or missed sync).
check_k8s_postgres_init_sync:
	@diff -q infra/database/combined/init_database.sql infra/k8s/base/stack/postgres-init/init_database.sql >/dev/null || \
	  (echo "ERROR: infra/k8s/base/stack/postgres-init/init_database.sql differs from canonical. Run: make sync_k8s_postgres_init or scripts/database/combine-migrations.sh"; exit 1)
	@diff -q infra/management-database/combined/init_management_database.sql infra/k8s/base/stack/postgres-init/init_management_database.sql >/dev/null || \
	  (echo "ERROR: infra/k8s/base/stack/postgres-init/init_management_database.sql differs from canonical. Run: make sync_k8s_postgres_init or scripts/database/combine-migrations.sh"; exit 1)
	@echo "Postgres-init SQL in sync with canonical."

local_k3d_up: sync_k8s_postgres_init
	bash scripts/infra/k3d/local-up.sh

local_k3d_down:
	bash scripts/infra/k3d/local-down.sh

local_argocd_port_forward:
	kubectl -n argocd port-forward svc/argocd-server 8080:443

local_k3d_status:
	kubectl -n boilerplate-local get pods,svc
