# Sortable filter tables – execution order

## Phase 1: Shared UI (sequential)

- **01** – Implement sortable headers in packages/ui: Table.SortableHeaderCell, optional sortKey on
  column, ResourceTableWithFilter and TableWithFilter use sortBy/sortOrder from URL and navigate
  on header click (reset page to 1).

## Phase 2: APIs (parallel after Phase 1)

- **02** – Management-api buckets: listBuckets + BucketService.listPaginated sortBy/sortOrder.
- **03** – Management-api users: listUsers sortBy/sortOrder.
- **04** – Management-api events: column-based sortBy/sortOrder (align/deprecate sort=oldest).
- **05** – Management-api admins: listAdmins + ManagementUserService.listAdminsPaginated
  sortBy/sortOrder.
- **06** – Api web buckets: listBuckets + BucketService.findAccessibleByUser sortBy/sortOrder.

## Phase 3: Pages (parallel after Phase 2)

- **07** – Management-web: buckets, users, events, admins pages – read sortBy/sortOrder from
  searchParams, pass to fetch and currentQueryParams.
- **08** – Web: buckets page – same.
