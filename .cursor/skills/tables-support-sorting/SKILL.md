---
name: tables-support-sorting
description: Ensure tables that display list data support sortable columns; use TableWithSort or Table.SortableHeaderCell and follow table-sort-defaults.
---

# Tables Support Sorting (Boilerplate)

Use this skill when adding or changing tables that display list data (e.g. buckets, admins, messages). Every such table should support sortable columns where it makes sense, so users can order by name, date, or other relevant fields.

## How to add sorting

1. **TableWithSort** (`packages/ui`): Use for tables that only need sortable headers (no filter bar, no pagination). It renders `Table` with a configurable header row: sortable columns use `Table.SortableHeaderCell`, others use `Table.HeaderCell`. You pass `columns` (with `sortable`, `sortKey`, `defaultSortOrder`), `sortBy`, `sortOrder`, and `onSortChange(sortKey)`. The parent owns sort state (e.g. URL params) and navigates or updates state in `onSortChange`.

2. **Table.SortableHeaderCell**: For one-off sortable headers or custom table layouts, use the base `Table.SortableHeaderCell` directly with `sortKey`, `label`, `activeSortBy`, `sortOrder`, `onSort`.

3. **TableWithFilter / ResourceTableWithFilter**: For list pages that already have a filter bar and pagination, these components already support sortable columns via `sortableColumnIds` and URL/cookie. No change needed unless adding new columns.

## Default sort order

Follow **table-sort-defaults** (`.cursor/skills/table-sort-defaults/SKILL.md`):

- String columns (e.g. name): `defaultSortOrder: 'asc'`
- Date columns (e.g. lastMessage, created): `defaultSortOrder: 'desc'`
- Number columns: `defaultSortOrder: 'asc'` unless "latest" is the goal

## Sort state

- **URL-driven**: For server-rendered pages, read `sortBy` and `sortOrder` from `searchParams`; sort data on the server; pass `sortBy`, `sortOrder`, and a base path (or callback) so the client can navigate to new sort params. Omit default sort from the URL for a clean default (e.g. `?tab=buckets` without `sortBy`/`sortOrder` when sort is name/asc).
- **Parent-controlled**: Pass `onSortChange(sortKey)` and let the parent update URL or local state and re-render.

## Example

Bucket detail topics table uses **TableWithSort**: columns Name (asc), Last Message (desc), Created (desc), plus non-sortable Public and Actions. The page reads `sortBy`/`sortOrder` from the URL, sorts child buckets, and passes `topicsSortBy`, `topicsSortOrder`, `topicsSortBasePath` into `BucketDetailContent`, which renders `TableWithSort` and navigates on header click.
