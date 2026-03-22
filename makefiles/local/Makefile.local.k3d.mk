.PHONY: local_k3d_up local_k3d_down local_argocd_port_forward local_k3d_status local_k3d_postgres_reset sync_k8s_postgres_init check_k8s_postgres_init_sync

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

# Delete Postgres PVC and pod so on next start the data dir is empty and init runs again with current secrets.
# Use when API fails with "password authentication failed for user boilerplate_app_read" (secrets were updated after Postgres was initialized).
# Requires the k3d cluster to be up (run make local_k3d_up first).
local_k3d_postgres_reset:
	@if ! k3d cluster list 2>/dev/null | grep -q "boilerplate-local"; then \
		echo "ERROR: local_k3d_postgres_reset requires the k3d cluster to be running."; \
		echo "Bring up the cluster first: make local_k3d_up"; \
		exit 1; \
	fi
	@echo "Scaling postgres down to detach volume..."
	kubectl -n boilerplate-local scale deployment postgres --replicas=0
	@echo "Waiting for postgres pod to terminate (max 90s)..."
	-kubectl -n boilerplate-local wait --for=delete pod -l app=postgres --timeout=90s
	@echo "Deleting postgres PVC..."
	kubectl -n boilerplate-local delete pvc boilerplate-postgres-data --ignore-not-found
	@echo "Waiting for postgres PVC deletion (max 120s)..."
	-kubectl -n boilerplate-local wait --for=delete pvc/boilerplate-postgres-data --timeout=120s
	@echo "Recreating postgres PVC..."
	kubectl apply -f infra/k8s/base/stack/pvc.yaml
	@echo "Waiting for postgres PVC to bind (max 120s)..."
	kubectl -n boilerplate-local wait --for=jsonpath='{.status.phase}'=Bound pvc/boilerplate-postgres-data --timeout=120s
	@echo "Scaling postgres back up..."
	kubectl -n boilerplate-local scale deployment postgres --replicas=1
	@echo "Waiting for postgres rollout (max 180s)..."
	kubectl -n boilerplate-local rollout status deployment/postgres --timeout=180s
	@echo "Postgres reset complete. Init scripts re-ran on fresh storage. Restart API services: kubectl -n boilerplate-local rollout restart deployment api management-api"

local_argocd_port_forward:
	kubectl -n argocd port-forward svc/argocd-server 8080:443

local_k3d_status:
	kubectl -n boilerplate-local get pods,svc
