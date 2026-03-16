# Sortable filter tables – summary

**Completed:** 2025-03-05. All phases (01–08) implemented: shared UI sortable headers, API sortBy/sortOrder, pages wired.

## Scope

Add API-driven sortable table headers to all filter table implementations. Clicking a column
header (except Actions) toggles ascending/descending; sort is reflected in URL and list requests.

## URL convention

- **sortBy** – column/field identifier (e.g. `name`, `email`, `timestamp`). Omit = API default.
- **sortOrder** – `asc` or `desc`. Omit = API default.
- When sort changes: update URL and reset `page` to 1 where pagination exists.

## Tables and APIs

| App             | Table    | Component              | List API              |
|-----------------|----------|------------------------|------------------------|
| management-web  | Buckets  | ResourceTableWithFilter| GET /buckets (mgmt-api)|
| management-web  | Users    | ResourceTableWithFilter| GET /users             |
| management-web  | Events   | TableWithFilter        | GET /events            |
| management-web  | Admins   | ResourceTableWithFilter| GET /admins            |
| web             | Buckets  | ResourceTableWithFilter| GET /buckets (api)     |

## Execution order

1. **01** – Shared UI (sortable headers, URL sync, reset page).
2. **02–06** – APIs: add sortBy/sortOrder to each list endpoint and service (can run in parallel).
3. **07–08** – Pages: wire sortBy/sortOrder in list pages (07 mgmt-web, 08 web).

## Key files

- UI: `packages/ui` (Table.SortableHeaderCell, ResourceTableWithFilter, TableWithFilter).
- Routing: do not auto-insert default sort into URL; include sortBy/sortOrder in
  currentQueryParams only when set.
- ORM: use entity property names (camelCase) in TypeORM orderBy.
