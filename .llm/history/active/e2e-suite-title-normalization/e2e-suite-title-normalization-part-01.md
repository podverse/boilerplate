# Feature: e2e-suite-title-normalization (Part 1)

## Metadata
- Started: 2026-03-11
- Completed: In Progress
- Context: Normalize top-level E2E suite titles to concise phrases; preserve verbose nested/test/step text.

## Sessions

### Session 1 - 2026-03-11

#### Prompt (Developer)

Implement `@boilerplate/.llm/plans/active/e2e-suite-title-normalization/01-guidance-memory-updates.md`

#### Key Decisions

- e2e-readability skill already stated suite-level = concise and nested/test/step = verbose; added one explicit sentence in Describe blocks so all three plan conditions are in one place (top-level concise, nested/test/step verbose, applies to both apps).
- Added `.cursor/rules/e2e-suite-title.mdc` so editing E2E specs triggers the suite-title convention and reduces drift.

#### Files Created/Modified

- .cursor/skills/e2e-readability/SKILL.md
- .cursor/rules/e2e-suite-title.mdc
- .llm/history/active/e2e-suite-title-normalization/e2e-suite-title-normalization-part-01.md

### Session 2 - 2026-03-11

#### Prompt (Developer)

Implement `@boilerplate/.llm/plans/active/e2e-suite-title-normalization/02-web-suite-title-sweep.md` (COPY-PASTA step 2)

#### Key Decisions

- Normalized all 80 web E2E specs: removed "This suite verifies the " (or "This suite verifies ") and trailing period from top-level `test.describe(...)`; capitalized first letter.
- Two URL-state-contract specs used "This suite verifies URL-state contracts..." (no "the"); replaced with "URL-state contracts for ...".
- Deleted 79 `.spec.ts.bak` files left by sed.

#### Files Created/Modified

- apps/web/e2e/*.spec.ts (80 files; top-level suite title only)
- .llm/history/active/e2e-suite-title-normalization/e2e-suite-title-normalization-part-01.md

### Session 3 - 2026-03-11

#### Prompt (Developer)

Implement `@boilerplate/.llm/plans/active/e2e-suite-title-normalization/03-management-web-suite-title-sweep.md` (COPY-PASTA step 3)

#### Key Decisions

- Normalized all 99 management-web E2E specs: removed "This suite verifies the " and trailing period from top-level `test.describe(...)`; capitalized first letter.
- Four URL-state-contract specs used "This suite verifies URL-state contracts..."; replaced with "URL-state contracts for ...".
- Deleted 95 `.spec.ts.bak` files left by sed.

#### Files Created/Modified

- apps/management-web/e2e/*.spec.ts (99 files; top-level suite title only)
- .llm/history/active/e2e-suite-title-normalization/e2e-suite-title-normalization-part-01.md

### Session 4 - 2026-03-11

#### Prompt (Developer)

Implement `@boilerplate/.llm/plans/active/e2e-suite-title-normalization/04-validation-and-report-smoke.md` (COPY-PASTA step 4)

#### Key Decisions

- Ran static checks only (no E2E run in-agent). All four patterns returned zero matches in web and management-web.
- Confirmed top-level suite titles are concise and nested/test/step labels remain verbose (spot-checked specs).
- Reporter uses `titlePath()` and first segment as describe label; concise suite titles will display as the muted label above each test—no reporter change needed unless follow-up requested.

#### Files Created/Modified

- .llm/history/active/e2e-suite-title-normalization/e2e-suite-title-normalization-part-01.md
