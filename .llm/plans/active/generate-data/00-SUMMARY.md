# Generate-data tool – Summary

## Scope

Add a CLI package under `tools/generate-data` that seeds the main and/or management databases with faker-generated test data. Support separate or combined runs and a configurable row count (default 100). Include documentation (per repo conventions) and a project skill so the tool stays in sync when new tables are added.

## Plan files

| ID | File |
| --- | --- |
| – | 00-EXECUTION-ORDER.md |
| – | 00-SUMMARY.md |
| 01 | 01-generate-data-package.md |

## Key deliverables

- Package: `tools/generate-data` (workspace), CLI with `main` | `management` | `both` and `--rows N`.
- Documentation: `tools/generate-data/TOOLS-GENERATE-DATA.md` (per documentation-conventions).
- Skill: `.cursor/skills/generate-data-sync/SKILL.md` – keep seeders in sync with new DB tables/entities.

## Related skills (existing)

- **documentation-conventions** – One README at root; directory docs named `[FULL-PATH-WITH-HYPHENS].md`.
- **database-schema-naming** – Snake_case columns, singular table names; entities map with `name`.
