# Bucket topics table sort + table-level sort support

**Started:** 2025-03-06  
**Context:** Add sortable columns (Name, Last Message, Created) to the bucket detail Topics table; make sorting a table-level capability via TableWithSort so any table can support sorting without a filter bar. Add tables-support-sorting skill.

---

### Session 1 - 2025-03-06

#### Prompt (Developer)

Bucket topics table sort + table-level sort support. Implement the plan as specified. Do NOT edit the plan file itself. To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **TableWithSort** in packages/ui: New component that renders Table with configurable sortable/plain header columns; accepts columns (sortKey, defaultSortOrder), sortBy, sortOrder, onSortChange; parent owns sort state (e.g. URL).
- **BucketDetailContent**: Optional props topicsSortBy, topicsSortOrder, topicsSortBasePath; when all set, render topics table with TableWithSort and navigate on sort click (clean URL: omit sortBy/sortOrder when default name/asc).
- **Pages (web + management-web)**: Read sortBy/sortOrder from searchParams when tab=buckets; sort child buckets by name (localeCompare), lastMessage (lastMessageAt, nulls last), created (createdAt); pass sorted topics and topicsSort* to BucketDetailContent.
- **Skill**: tables-support-sorting added; table-sort-defaults updated to reference TableWithSort and the new skill.

#### Files Created/Modified

- packages/ui/src/components/table/TableWithSort/TableWithSort.tsx (new)
- packages/ui/src/components/table/TableWithSort/index.ts (new)
- packages/ui/src/index.ts (export TableWithSort)
- packages/ui/src/components/bucket/BucketDetailContent/BucketDetailContent.tsx
- apps/web/src/app/(main)/bucket/[id]/page.tsx
- apps/management-web/src/app/(main)/bucket/[id]/page.tsx
- .cursor/skills/tables-support-sorting/SKILL.md (new)
- .cursor/skills/table-sort-defaults/SKILL.md
