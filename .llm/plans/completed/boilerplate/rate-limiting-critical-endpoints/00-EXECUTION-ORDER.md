# Rate limiting critical endpoints – Execution Order

Run phases sequentially. Within a phase, run plan files in order unless marked parallel.

## Plan file location

All plans: `.llm/plans/active/rate-limiting-critical-endpoints/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, endpoints, decisions |
| [01-rate-limiting-critical-endpoints.md](01-rate-limiting-critical-endpoints.md) | Implement rate limiting (middleware, apply to APIs, tests, docs) |

## Phase 1: Implement rate limiting

1. **01-rate-limiting-critical-endpoints** – Single plan: choose strategy (e.g. express-rate-limit
   or Valkey-backed), add middleware, apply to critical endpoints in **apps/api only**, add
   tests and document limits.

## Rules

- Do not implement until the user asks; execute the plan incrementally.
- Phases are sequential.
