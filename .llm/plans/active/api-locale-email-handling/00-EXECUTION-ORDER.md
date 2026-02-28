# API locale and email handling – Execution Order

Run phases sequentially. Within a phase, run plan files in order unless marked parallel.

## Plan file location

All plans: `.llm/plans/active/api-locale-email-handling/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, touch points, decisions |
| [01-api-locale-email-handling.md](01-api-locale-email-handling.md) | Locale at email touch points; API messages en-US only |

## Phase 1: Implement locale handling

1. **01-api-locale-email-handling** – Add preferred-locale handling for user-facing API
   touch points (emails). Keep all API status/error messages in American English. Implement
   locale resolution, mailer locale parameter, and email content by locale.

## Rules

- Do not implement until the user asks; execute the plan incrementally.
- Phases are sequential.
