# i18n translations audit – Execution Order

Run phases sequentially. Within a phase, run plan files in order unless marked parallel.

## Plan file location

All plans: `.llm/plans/completed/boilerplate/i18n-translations-audit/`

| File | Description |
| --- | --- |
| [00-SUMMARY.md](00-SUMMARY.md) | Scope, inventory, decisions |
| [01-i18n-audit-and-process.md](01-i18n-audit-and-process.md) | Scan pages/components for i18n; fix gaps; harden process |

## Phase 1: Audit and fix

1. **01-i18n-audit-and-process** – Scan all pages and components for user-facing strings;
   ensure they use i18n (t/useTranslations). Fix any hardcoded strings. Harden the i18n
   process (scripts, validation, CI, key conventions).

## Rules

- Do not implement until the user asks; execute the plan incrementally.
- Phases are sequential.
