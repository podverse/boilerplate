#!/usr/bin/env python3
"""
Destructive remote K8s Option B: delete Postgres (and optionally Valkey) PVCs, wait for pods,
then bootstrap management DB + schema + role users + grants from Kubernetes Secrets.

Prerequisites: kubectl configured. Run from Boilerplate repo root so infra/database paths resolve.

Align Secrets and apply them BEFORE running this script (see docs/development/REMOTE-K8S-POSTGRES-REINIT.md §1).
"""

import argparse
import base64
import json
import re
import secrets
import subprocess
import time
from pathlib import Path
from typing import List, Optional


def run(
    cmd: List[str],
    *,
    input_bytes: Optional[bytes] = None,
    check: bool = True,
) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, input=input_bytes, check=check)


def kubectl_json(args: List[str]) -> dict:
    out = subprocess.check_output(['kubectl', *args])
    return json.loads(out)


def secret_key(ns: str, secret_name: str, key: str) -> str:
    data = kubectl_json(['get', 'secret', secret_name, '-n', ns, '-o', 'json'])
    raw = data.get('data', {}).get(key)
    if raw is None:
        raise SystemExit(f"Secret {secret_name} missing data key {key!r}")
    return base64.b64decode(raw).decode('utf-8')


def assert_safe_ident(name: str, label: str) -> str:
    if not re.fullmatch(r'[a-zA-Z_][a-zA-Z0-9_]*', name):
        raise SystemExit(f"Unsafe {label} identifier (allowed [a-zA-Z_][a-zA-Z0-9_]*): {name!r}")
    return name


def psql_stdin(ns: str, db: str, pg_user: str, pg_password: str, sql: bytes) -> None:
    cmd = [
        'kubectl',
        'exec',
        '-i',
        '-n',
        ns,
        'deploy/postgres',
        '--',
        'env',
        f'PGPASSWORD={pg_password}',
        'psql',
        '-v',
        'ON_ERROR_STOP=1',
        '-U',
        pg_user,
        '-d',
        db,
        '-f',
        '-',
    ]
    run(cmd, input_bytes=sql)


def psql_c(ns: str, db: str, pg_user: str, pg_password: str, sql: str) -> None:
    psql_stdin(ns, db, pg_user, pg_password, (sql + '\n').encode('utf-8'))


def psql_scalar(ns: str, pg_user: str, pg_password: str, sql: str) -> str:
    cmd = [
        'kubectl',
        'exec',
        '-n',
        ns,
        'deploy/postgres',
        '--',
        'env',
        f'PGPASSWORD={pg_password}',
        'psql',
        '-tAc',
        sql,
        '-U',
        pg_user,
        '-d',
        'postgres',
    ]
    out = subprocess.check_output(cmd, text=True)
    return out.strip()


def scale(ns: str, deployment: str, replicas: int) -> None:
    run(['kubectl', '-n', ns, 'scale', f'deployment/{deployment}', f'--replicas={replicas}'])


def delete_pvc(ns: str, name: str) -> None:
    run(['kubectl', '-n', ns, 'delete', 'pvc', name, '--wait=true'])


def rollout_status(ns: str, deployment: str, timeout: str = '300s') -> None:
    run(['kubectl', '-n', ns, 'rollout', 'status', f'deployment/{deployment}', f'--timeout={timeout}'])


def dollar_tag_for(s: str) -> str:
    tag = 'p'
    while f'${tag}$' in s:
        tag = 'p' + secrets.token_hex(4)
    return tag


def create_user_block(rolename: str, password: str) -> str:
    assert_safe_ident(rolename, 'role')
    tag = dollar_tag_for(password)
    dq = f'${tag}${password}${tag}$'
    return f"""
DO $outer$
DECLARE
  pw TEXT := {dq};
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '{rolename}') THEN
    EXECUTE format('CREATE USER %I WITH PASSWORD %L', '{rolename}', pw);
  END IF;
END
$outer$;
"""


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--namespace', default='boilerplate-alpha', help='Kubernetes namespace')
    ap.add_argument('--with-valkey', action='store_true', help='Also reset Valkey PVC (boilerplate-valkey-data)')
    ap.add_argument(
        '--bootstrap-only',
        action='store_true',
        help='Skip PVC deletion; only run SQL bootstrap (postgres must be up)',
    )
    ap.add_argument(
        '--pvc-only',
        action='store_true',
        help='Only reset PVC(s) and wait for rollouts; do not run SQL',
    )
    ap.add_argument(
        '--repo-root',
        type=Path,
        default=None,
        help='Boilerplate repo root (default: parent of scripts/k8s)',
    )
    args = ap.parse_args()
    ns = args.namespace
    root = (args.repo_root or Path(__file__).resolve().parents[2]).resolve()

    init_app = root / 'infra/database/combined/init_database.sql'
    init_mgmt = root / 'infra/management-database/combined/init_management_database.sql'
    if not args.pvc_only:
        if not init_app.is_file():
            raise SystemExit(f"Missing {init_app} (run from Boilerplate repo root or pass --repo-root)")
        if not init_mgmt.is_file():
            raise SystemExit(f"Missing {init_mgmt}")

    if args.bootstrap_only and args.pvc_only:
        raise SystemExit('Use only one of --bootstrap-only or --pvc-only')

    if not args.bootstrap_only:
        print('Scaling postgres to 0...')
        scale(ns, 'postgres', 0)
        rollout_status(ns, 'postgres', '120s')
        print('Deleting PVC boilerplate-postgres-data...')
        delete_pvc(ns, 'boilerplate-postgres-data')
        print('Scaling postgres to 1...')
        scale(ns, 'postgres', 1)
        rollout_status(ns, 'postgres')
        print('Postgres rollout complete.')

        if args.with_valkey:
            print('Scaling valkey to 0...')
            scale(ns, 'valkey', 0)
            rollout_status(ns, 'valkey', '120s')
            print('Deleting PVC boilerplate-valkey-data...')
            delete_pvc(ns, 'boilerplate-valkey-data')
            print('Scaling valkey to 1...')
            scale(ns, 'valkey', 1)
            rollout_status(ns, 'valkey')
            print('Valkey rollout complete.')

    if args.pvc_only:
        return

    db_user = secret_key(ns, 'boilerplate-db-secrets', 'DB_USER')
    db_password = secret_key(ns, 'boilerplate-db-secrets', 'DB_PASSWORD')
    app_db = assert_safe_ident(secret_key(ns, 'boilerplate-db-secrets', 'DB_APP_NAME'), 'DB_APP_NAME')
    # DB_MANAGEMENT_NAME is in env group `db` → boilerplate-db-secrets (not api; main API does not inherit it).
    mgmt_db = assert_safe_ident(
        secret_key(ns, 'boilerplate-db-secrets', 'DB_MANAGEMENT_NAME'),
        'DB_MANAGEMENT_NAME',
    )

    app_read_u = assert_safe_ident(secret_key(ns, 'boilerplate-api-secrets', 'DB_APP_READ_USER'), 'DB_APP_READ_USER')
    app_read_p = secret_key(ns, 'boilerplate-api-secrets', 'DB_APP_READ_PASSWORD')
    app_rw_u = assert_safe_ident(
        secret_key(ns, 'boilerplate-api-secrets', 'DB_APP_READ_WRITE_USER'),
        'DB_APP_READ_WRITE_USER',
    )
    app_rw_p = secret_key(ns, 'boilerplate-api-secrets', 'DB_APP_READ_WRITE_PASSWORD')

    mgmt_read_u = assert_safe_ident(
        secret_key(ns, 'boilerplate-management-api-secrets', 'DB_MANAGEMENT_READ_USER'),
        'DB_MANAGEMENT_READ_USER',
    )
    mgmt_read_p = secret_key(ns, 'boilerplate-management-api-secrets', 'DB_MANAGEMENT_READ_PASSWORD')
    mgmt_rw_u = assert_safe_ident(
        secret_key(ns, 'boilerplate-management-api-secrets', 'DB_MANAGEMENT_READ_WRITE_USER'),
        'DB_MANAGEMENT_READ_WRITE_USER',
    )
    mgmt_rw_p = secret_key(ns, 'boilerplate-management-api-secrets', 'DB_MANAGEMENT_READ_WRITE_PASSWORD')

    print('Waiting for Postgres to accept connections...')
    deadline = time.time() + 120
    while time.time() < deadline:
        try:
            if psql_scalar(ns, db_user, db_password, 'SELECT 1') == '1':
                break
        except subprocess.CalledProcessError:
            pass
        time.sleep(3)
    else:
        raise SystemExit('Postgres did not become ready in time')

    exists = psql_scalar(ns, db_user, db_password, f"SELECT 1 FROM pg_database WHERE datname = '{mgmt_db}'")
    if exists != '1':
        print(f'Creating database {mgmt_db}...')
        psql_c(ns, 'postgres', db_user, db_password, f'CREATE DATABASE {mgmt_db};')

    print(f'Applying main schema to {app_db}...')
    psql_stdin(ns, app_db, db_user, db_password, init_app.read_bytes())

    print(f'Applying management schema to {mgmt_db}...')
    psql_stdin(ns, mgmt_db, db_user, db_password, init_mgmt.read_bytes())

    print('Creating role users (if missing)...')
    role_sql = ''.join(
        [
            create_user_block(app_read_u, app_read_p),
            create_user_block(app_rw_u, app_rw_p),
            create_user_block(mgmt_read_u, mgmt_read_p),
            create_user_block(mgmt_rw_u, mgmt_rw_p),
        ]
    )
    psql_c(ns, 'postgres', db_user, db_password, role_sql)

    print('Grants on app database...')
    grants_app = f"""
GRANT CONNECT ON DATABASE {app_db} TO {app_read_u}, {app_rw_u};
GRANT USAGE ON SCHEMA public TO {app_read_u}, {app_rw_u};
GRANT SELECT ON ALL TABLES IN SCHEMA public TO {app_read_u};
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO {app_read_u};
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public TO {app_rw_u};
GRANT SELECT, USAGE, UPDATE ON ALL SEQUENCES IN SCHEMA public TO {app_rw_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO {app_read_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO {app_read_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO {app_rw_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, USAGE, UPDATE ON SEQUENCES TO {app_rw_u};
"""
    psql_c(ns, app_db, db_user, db_password, grants_app)

    print('Grants on management database...')
    grants_mgmt = f"""
GRANT CONNECT ON DATABASE {mgmt_db} TO {mgmt_read_u}, {mgmt_rw_u};
GRANT USAGE ON SCHEMA public TO {mgmt_read_u}, {mgmt_rw_u};
GRANT SELECT ON ALL TABLES IN SCHEMA public TO {mgmt_read_u};
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO {mgmt_read_u};
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public TO {mgmt_rw_u};
GRANT SELECT, USAGE, UPDATE ON ALL SEQUENCES IN SCHEMA public TO {mgmt_rw_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO {mgmt_read_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO {mgmt_read_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON TABLES TO {mgmt_rw_u};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, USAGE, UPDATE ON SEQUENCES TO {mgmt_rw_u};
"""
    psql_c(ns, mgmt_db, db_user, db_password, grants_mgmt)

    print('Bootstrap finished. Restart API deployments and create management super admin (REMOTE-K8S-GITOPS Step 12).')
    print(f'  kubectl -n {ns} rollout restart deployment/api deployment/management-api')


if __name__ == '__main__':
    main()
