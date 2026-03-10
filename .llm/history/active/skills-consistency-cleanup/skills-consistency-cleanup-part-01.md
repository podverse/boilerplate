# Skills Consistency Cleanup

**Started:** 2026-03-10  
**Context:** Plan "Boilerplate Skills Consistency Cleanup Plan" — remove redundancies, resolve incongruencies, and align skill ownership/cross-links.

---

### Session 1 - 2026-03-10

#### Prompt (Developer)

Boilerplate Skills Consistency Cleanup Plan

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Resolved high-risk inconsistencies first: nested permission naming (`bucketMessagesCrud`) and E2E step-label wording.
- Clarified planning vs implementation boundaries so planning captures test tasks while implementation updates actual tests.
- Centralized testing requirement ownership in `feature-implementation-testing`; `api-testing` and `e2e-page-tests` now focus on execution guidance.
- Applied hub-and-spoke ownership in sorting/tab skills to reduce overlap and future drift.
- Made `llm-history` the canonical history process reference and reduced duplicated process wording in `global` and `AGENTS.md`.

#### Files Modified

- .cursor/skills/roles-schema-sync/SKILL.md
- .cursor/skills/e2e-page-tests/SKILL.md
- .cursor/skills/feature-implementation-testing/SKILL.md
- .cursor/skills/plan-files-convention/SKILL.md
- .cursor/skills/api-testing/SKILL.md
- .cursor/skills/api/SKILL.md
- .cursor/skills/tables-support-sorting/SKILL.md
- .cursor/skills/table-sort-defaults/SKILL.md
- .cursor/skills/sort-prefs-cookie-by-path/SKILL.md
- .cursor/skills/management-edit-page-tabs/SKILL.md
- .cursor/skills/tab-active-state-url-match/SKILL.md
- .cursor/skills/llm-history/SKILL.md
- .cursor/skills/global/SKILL.md
- .cursor/skills/e2e-url-state-contracts/SKILL.md
- .cursor/skills/response-ending-make-verify/SKILL.md
- AGENTS.md

### Session 2 - 2026-03-10

#### Prompt (Developer)

   Legacy note: if you encounter older unprefixed names while reading existing code, treat them as historical and prefer prefixed names for new or modified schema and API fields.

sweep through the boilerplate and update any older unprefixed names you find, so that this legacy note can be removed

#### Key Decisions

- Ran a repository sweep and replaced unprefixed bucket-message CRUD field/column names with prefixed names across API, management-api, web, management-web, helpers, ORM, SQL, and docs.
- Removed the legacy fallback wording from roles-schema-sync after confirming no remaining non-.llm occurrences of `messageCrud`/`message_crud` patterns.
- Kept user-facing copy readable (e.g., \"Message permissions\") while renaming schema/API field keys and related label variable keys.

#### Files Modified

- See `.llm/history/active/bucket-messages-prefix-rename/bucket-messages-prefix-rename-part-01.md` for the comprehensive file list from this sweep.
