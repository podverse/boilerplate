# Remote K8s: reset Postgres data and align env

**Destructive:** Deletes database files on the volume. Use for disposable envs (e.g. alpha), not production without a backup plan.

**Context:** Changing Kubernetes Secrets does **not** change passwords already stored in Postgres. If secrets and the PVC are out of sync, wipe the volume and bootstrap again.

Full GitOps context: [REMOTE-K8S-GITOPS.md](REMOTE-K8S-GITOPS.md), env render: [K8S-ENV-RENDER.md](K8S-ENV-RENDER.md).

Replace **`boilerplate-alpha`** with your namespace if different.

---

## Option B (automated): one script for PVC wipe + bootstrap

From the **Boilerplate** repo root, after **§1** (Secrets applied in the cluster and consistent across **`boilerplate-db-secrets`**, **`boilerplate-api-secrets`**, **`boilerplate-management-api-secrets`**):

```bash
./scripts/k8s/remote_postgres_reinit_bootstrap.py --namespace boilerplate-alpha
```

Also reset Valkey if **`VALKEY_PASSWORD`** changed and the old volume is incompatible:

```bash
./scripts/k8s/remote_postgres_reinit_bootstrap.py --namespace boilerplate-alpha --with-valkey
```

Flags:

| Flag                   | Meaning                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **`--bootstrap-only`** | Skip PVC deletion; run SQL bootstrap only (Postgres already up with empty/existing DBs you want to re-seed). |
| **`--pvc-only`**       | Only delete PVC(s) and wait for rollouts (no SQL).                                                           |

The script reads role names and passwords from the same Secrets the API Deployments use, applies **`infra/database/combined/init_database.sql`** and **`infra/management-database/combined/init_management_database.sql`**, creates the four ORM roles if missing, and runs the same **GRANT** pattern as **`makefiles/local/Makefile.local.test.mk`** (`test_db_init` / `test_db_init_management`).

**Requires:** **`kubectl`** configured for the cluster; **Python 3** on the machine running the script (stdlib only).

Then restart APIs and bootstrap the management super admin (**§5** and [REMOTE-K8S-GITOPS.md](REMOTE-K8S-GITOPS.md) Step 12).

---

## 1. Align committed GitOps + Boilerplate (ConfigMaps / plain secrets)

From the **Boilerplate** repo root (with your GitOps clone path):

```bash
export BOILERPLATE_K8S_OUTPUT_REPO="/absolute/path/to/your/gitops-repo"
./scripts/nix/with-env make alpha_env_validate
./scripts/nix/with-env make alpha_env_render
```

Edit **`apps/boilerplate-alpha/env/remote-k8s.yaml`** (and any **`dev/env-overrides/alpha/*.env`** you use) until validate passes; re-run render after edits.

Commit and push the GitOps repo **`main`** (ConfigMaps, **`deployment-secret-env.yaml`**, port patches as generated).

Edit **`secrets/boilerplate-alpha/plain/boilerplate-*-secrets.yaml`** so every **`DB_*`** / **`VALKEY_*`** value is what you want **before** encrypting. **`boilerplate-db-secrets`**, **`boilerplate-api-secrets`**, and **`boilerplate-management-api-secrets`** must agree on shared keys (same app DB name, same **`DB_APP_*`** role passwords, etc.).

From the **GitOps** repo root:

```bash
./scripts/encrypt_boilerplate_plain_secrets.sh --namespace boilerplate-alpha
./scripts/apply_boilerplate_encrypted_secrets.sh --namespace boilerplate-alpha
```

Commit only **`*.enc.yaml`** (not cleartext **`plain/`** if your repo ignores it). Sync Argo (or wait for auto-sync).

---

## 2. Optional: reset Valkey if **`VALKEY_PASSWORD`** changed

If the Valkey PVC was initialized with an old password, delete its data too (same pattern as Postgres):

```bash
kubectl -n boilerplate-alpha scale deployment/valkey --replicas=0
kubectl -n boilerplate-alpha delete pvc boilerplate-valkey-data
```

Argo (or scale back up) recreates the Deployment; a new pod + empty volume picks up the current Secret.

---

## 3. Delete Postgres PVC (drop all Postgres data)

```bash
kubectl -n boilerplate-alpha scale deployment/postgres --replicas=0
kubectl -n boilerplate-alpha delete pvc boilerplate-postgres-data
kubectl -n boilerplate-alpha scale deployment/postgres --replicas=1
```

Wait until **`kubectl -n boilerplate-alpha get pods`** shows **`postgres`** **Running**.

On first start with an **empty** volume, the image creates the cluster using **`POSTGRES_USER`** / **`POSTGRES_PASSWORD`** / **`POSTGRES_DB`** from **`boilerplate-db-secrets`** (see monorepo **`infra/k8s/base/db/deployment-postgres.yaml`**). That creates only the **app** database (typically **`DB_APP_NAME`**). It does **not** create app/management role users or the management database.

---

## 4. Bootstrap schema and roles (manual alternative to the script)

If you prefer not to use **`scripts/k8s/remote_postgres_reinit_bootstrap.py`**, work from **Boilerplate** repo root so paths resolve. Forward Postgres:

```bash
kubectl -n boilerplate-alpha port-forward svc/postgres 5432:5432
```

In a **second** terminal, load names/passwords from the cluster (adjust secret names if yours differ):

```bash
export NS=boilerplate-alpha
export PGHOST=127.0.0.1
export PGPORT=5432
export PGUSER=$(kubectl get secret boilerplate-db-secrets -n "$NS" -o jsonpath='{.data.DB_USER}' | base64 -d)
export PGPASSWORD=$(kubectl get secret boilerplate-db-secrets -n "$NS" -o jsonpath='{.data.DB_PASSWORD}' | base64 -d)
export APP_DB=$(kubectl get secret boilerplate-db-secrets -n "$NS" -o jsonpath='{.data.DB_APP_NAME}' | base64 -d)
export MGMT_DB=$(kubectl get secret boilerplate-db-secrets -n "$NS" -o jsonpath='{.data.DB_MANAGEMENT_NAME}' | base64 -d)
```

Create the **management** database (empty):

```bash
psql -d postgres -c "CREATE DATABASE \"$MGMT_DB\";"
```

Apply combined schema (main app DB, then management DB):

```bash
psql -d "$APP_DB" -f infra/database/combined/init_database.sql
psql -d "$MGMT_DB" -f infra/management-database/combined/init_management_database.sql
```

Create **role** users with passwords **identical** to the Secrets the APIs use. Read passwords from Secrets (same `base64 -d` pattern as above) for:

- **`DB_APP_READ_USER`** / **`DB_APP_READ_PASSWORD`**
- **`DB_APP_READ_WRITE_USER`** / **`DB_APP_READ_WRITE_PASSWORD`**
- **`DB_MANAGEMENT_READ_USER`** / **`DB_MANAGEMENT_READ_PASSWORD`**
- **`DB_MANAGEMENT_READ_WRITE_USER`** / **`DB_MANAGEMENT_READ_WRITE_PASSWORD`**

Example (replace **`…`** with real usernames/passwords from your Secrets; escape single quotes in passwords as **`''`** inside SQL):

```bash
psql -d postgres -v ON_ERROR_STOP=1 -c "CREATE ROLE \"…\" LOGIN PASSWORD '…';"
# repeat for each of the four roles, or use one DO block — see makefiles/local/Makefile.local.test.mk
```

Then run the **`GRANT`** / **`ALTER DEFAULT PRIVILEGES`** blocks for the app database and the management database. **Canonical copy-paste:** duplicate the logic in **`makefiles/local/Makefile.local.test.mk`** targets **`test_db_init`** and **`test_db_init_management`**, substituting:

- **`$(TEST_DB_NAME)`** → **`$APP_DB`**
- **`$(TEST_MANAGEMENT_DB_NAME)`** → **`$MGMT_DB`**
- **`'test'`** passwords → the real values from your Secrets

---

## 5. Restart API workloads and verify

```bash
kubectl -n boilerplate-alpha rollout restart deployment/api deployment/management-api
kubectl -n boilerplate-alpha logs deployment/api --tail=80
kubectl -n boilerplate-alpha logs deployment/management-api --tail=80
```

Create the first management super admin once the management API is healthy: [REMOTE-K8S-GITOPS.md](REMOTE-K8S-GITOPS.md) — **Step 12**.

---

## 6. Quick alignment checklist

| Check                                                    | Where                                                                                                                                                                                         |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Non-secret env (URLs, **AUTH_MODE**, cookies, agents, …) | Rendered ConfigMaps in GitOps; **`make alpha_env_validate`**                                                                                                                                  |
| DB superuser + **`DB_APP_NAME`**                         | **`boilerplate-db-secrets`** → Postgres **`POSTGRES_*`**                                                                                                                                      |
| App ORM users                                            | **`boilerplate-api-secrets`** **`DB_APP_*`** = roles + passwords in Postgres                                                                                                                  |
| Management DB name + ORM users                           | **`DB_MANAGEMENT_NAME`** in **`boilerplate-db-secrets`** (cluster-wide); **`DB_MANAGEMENT_READ_*` / `DB_MANAGEMENT_READ_WRITE_*`** in **`boilerplate-management-api-secrets`** match Postgres |
| Valkey                                                   | **`VALKEY_PASSWORD`** consistent across **`api`**, **`management-api`**, **`valkey`** secrets and a fresh Valkey volume if you rotated it                                                     |
