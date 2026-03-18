# 12 – Skills and Cursor rules review

## Scope

Review all SKILLS (`.cursor/skills/`) and Cursor rules (`.cursor/rules/`) for coverage, clarity,
and duplication. Remove or merge duplicates; ensure naming and triggers are clear; identify gaps
(e.g. missing skill for api-testing, e2e, i18n) and add or update. Align with AGENTS.md and
plan-files-convention; document how to choose a skill for a task.

## Steps

### 1. List all skills and rules

- List every file under `.cursor/skills/` (e.g. `api/SKILL.md`, `i18n/SKILL.md`,
  `e2e-page-tests/SKILL.md`). For each, note: name, short description, and when to use (from
  the skill’s description or frontmatter).
- List every file under `.cursor/rules/` (e.g. `*.mdc`). For each, note: trigger (glob or
  description), and what it enforces (e.g. eqeqeq, no type assertions, history tracking).
- Build a simple map: “For task X, use skill Y” and “When editing file Z, rules A and B apply.”

### 2. Remove or merge duplicates

- If two skills cover the same scope (e.g. two “API” skills), merge them into one or clearly
  differentiate (e.g. “API routes” vs “API testing”). Update any references in AGENTS.md or
  other docs.
- If a rule and a skill say the same thing, keep one (usually the rule for automatic
  application, or the skill for “when you’re doing X, do Y”). Remove redundant wording.
- Ensure naming is consistent (e.g. kebab-case for skill dirs, clear rule names).

### 3. Identify gaps

- Cross-reference common tasks: API changes, E2E changes, i18n, form components, permissions,
  plan files, history tracking. For each, check if there is a skill or rule that guides the
  agent. If not, add a short skill (or rule) or document in AGENTS.md that “for X, do Y” (e.g.
  “for API route changes, add integration tests; see api-testing skill”).
- Ensure plan-files-convention and llm-history are clearly referenced so agents know where to
  save plans and how to update history.

### 4. Align with AGENTS.md

- Ensure AGENTS.md (or equivalent) lists or links to the main skills and rules. Add a short
  “When to use which skill” or “Key skills” section if missing. Point to plan-files-convention
  for multi-step plans and COPY-PASTA execution.
- After edits, read through AGENTS.md to ensure it’s consistent with the current set of skills
  and rules.

### 5. Verify

- No two skills or rules contradict each other. Gaps are filled or explicitly documented.
  AGENTS.md is up to date.

## Key files

- `.cursor/skills/` (all SKILL.md or equivalent)
- `.cursor/rules/` (all .mdc or rule files)
- `AGENTS.md` at repo root

## Verification

- Duplicates removed or merged; naming and triggers clear.
- Gaps documented or filled; AGENTS.md points to key skills and explains when to use them.
- Plan-files-convention and history-tracking are clearly referenced for file-modifying work.
