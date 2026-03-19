# Web dashboard – Summary

## Scope

Dashboard page with message form, list (real-time via polling or WebSocket), Valkey storage,
privacy toggle. Login and signup pages; protected routes redirect to login.

## Plan files

| ID | File | Description |
| --- | --- | --- |
| 22 | [22-dashboard-realtime.md](22-dashboard-realtime.md) | Dashboard + messages API + auth UI |

## Dependencies

- Auth (plan 15), i18n (21), settings (20), Valkey (04), basic components (19).
