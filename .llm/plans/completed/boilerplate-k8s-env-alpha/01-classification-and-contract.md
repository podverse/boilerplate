# 01 — Classification contract

## Scope

- File: [`infra/k8s/env/classification.yaml`](../../../../infra/k8s/env/classification.yaml).
- One workload per K8s Deployment that consumes env: `api`, `management-api`, `web`,
  `web-sidecar`, `management-web`, `management-web-sidecar`, `postgres`, `valkey`.

## Schema (`classification.yaml`)

| Field | Meaning |
|-------|---------|
| `version` | File format version. |
| `namespace_label` | Metadata label key for environment (value set at render from `ENV`). |
| `workloads.<name>.source_files` | Repo-relative paths to authoritative `.env.example` files. |
| `workloads.<name>.no_env_from` | If true, no ConfigMap/Secret; only `literals` apply (e.g. web shell). |
| `workloads.<name>.literals` | Keys set in Deployment `env:`; excluded from CM/Secret. |
| `workloads.<name>.literals_only_in_source` | Keys present in a shared template but not injected into this workload’s pod. |
| `workloads.<name>.keys.<KEY>` | `config` (ConfigMap `data`) or `secret` (Secret `stringData`). |

## Rules

- Each key appears under **at most one** tier (`config` or `secret`) per workload.
- Keys listed under `literals` are set in YAML `env:` and must **not** appear in generated CM/Secret.
- Source paths are relative to Boilerplate repo root.
- Every `KEY=` line in each listed `source_files` entry must appear under `keys`, `literals`, or
  `literals_only_in_source` for that workload (enforced by `validate-classification.sh`).

## Verification

```bash
make alpha_env_validate
# or
bash scripts/k8s-env/validate-classification.sh
```
