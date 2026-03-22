# Web dashboard – Execution Order

Single-plan set: dashboard and real-time messages (main web frontend Phase 7b).

## Plan file location

All plans: `.llm/plans/active/web-dashboard/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope and dependency map |
| [22-dashboard-realtime.md](22-dashboard-realtime.md) | Dashboard, messages API, login/signup pages, Valkey, privacy toggle |
| [COPY-PASTA.md](COPY-PASTA.md) | Copy-paste prompt |

## Order

1. **22-dashboard-realtime** – Run once. Depends on auth (15), i18n (21), settings (20), Valkey (04).
