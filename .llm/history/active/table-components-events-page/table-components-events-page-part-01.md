# Table components and Events page

**Started:** 2026-02-28  
**Context:** Plan from .cursor/plans (table_components_and_events_page_c2096e66.plan.md): date helper in helpers-i18n, Table in packages/ui, Events page refactor with i18n keys.

---

### Session 1 - 2026-02-28

#### Prompt (Developer)

Table components, date helper, and Events page refresh

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Used `ThHTMLAttributes<HTMLTableCellElement>` for `TableHeaderCellProps` so `scope` is valid (fixes build).
- Table has no internal i18n; column labels come from management-web `common.eventsTable.*`.
- Only `.body .row:last-child .cell` gets border removed in Table SCSS (header row keeps border).
- helpers-i18n has no README; no doc added for `formatDateTimeReadable`.

#### Files Created/Modified

- `packages/helpers-i18n/src/format-date.ts` (added)
- `packages/helpers-i18n/src/index.ts` (export formatDateTimeReadable)
- `packages/ui/src/components/Table/Table.tsx`, `Table.module.scss`, `index.ts`, `Table.stories.tsx` (added)
- `packages/ui/src/index.ts` (export Table)
- `apps/management-web/src/app/(main)/events/page.tsx` (Table + formatDateTimeReadable, getLocale)
- `apps/management-web/i18n/originals/en-US.json`, `originals/es.json`, `overrides/es.json` (eventsTable keys)
- `packages/ui/src/components/Table/Table.module.scss` (last-row border fix)
- `packages/ui/src/components/Table/Table.tsx` (TableHeaderCellProps type fix)

---

### Session 2 - 2026-02-28

#### Prompt (Developer)

make the Admins page use tables as well

make sure the tables have reasonable responsivity. there may need to be a sensible minimum width on the columns and there may need to be horizontal scrolling within the table if the table can't fill the full width of the page

#### Key Decisions

- Added `Table.ScrollContainer` in packages/ui: a wrapper div with `overflow-x: auto` and `width: 100%` so the table can scroll horizontally when narrow.
- Table root has `min-width: 32rem`; `.headerCell` and `.cell` have `min-width: 6rem` so columns don’t squash and the container scrolls when needed.
- Events page and Admins page both use `Table.ScrollContainer` around the table.
- Admins table columns: Email, Display name (empty shown as "—"). i18n keys: `common.adminsTable.email`, `common.adminsTable.displayName`.

#### Files Created/Modified

- `packages/ui/src/components/Table/Table.tsx` (TableScrollContainer, Table.ScrollContainer)
- `packages/ui/src/components/Table/Table.module.scss` (scrollContainer, root min-width, cell min-widths)
- `packages/ui/src/components/Table/index.ts`, `packages/ui/src/index.ts` (export TableScrollContainerProps)
- `packages/ui/src/components/Table/Table.stories.tsx` (WithScrollContainer story)
- `apps/management-web/src/app/(main)/events/page.tsx` (wrap Table in Table.ScrollContainer)
- `apps/management-web/src/app/(main)/admins/page.tsx` (Table with Email, Display name)
- `apps/management-web/i18n/originals/en-US.json`, `originals/es.json`, `overrides/es.json` (adminsTable keys)

---

### Session 3 - 2026-02-28

#### Prompt (Developer)

The events page should have a sort drop down by recent and oldest and At the bottom Hub the table should be a drop down that lets you select how many items to display

#### Key Decisions

- Backend (ORM + management-api): `EventsSortOrder` and `order` on list options; API reads `sort` query (recent/oldest) and passes to service.
- Management-web: `EventsSortSelect` (Recent/Oldest) above table; `EventsLimitSelect` (10, 20, 50, 100) below table; both use URL params and `router.push`.
- Pagination: added optional `queryParams?: Record<string, string>` so Events page can pass `{ sort: 'oldest' }` and pagination links preserve sort.
- Sort and limit dropdowns shown even when there are no events (when error is null); limit options include current limit if not in preset list.
- i18n: `common.eventsSort.label`, `common.eventsSortOptions.recent`/`oldest`, `common.eventsLimit.label` in en-US, es, overrides/es; EventsSortSelect accepts `sortOptionLabels` from server.

#### Files Created/Modified

- `packages/management-orm/src/services/ManagementEventService.ts` (sort order)
- `apps/management-api/src/controllers/eventsController.ts` (sort query)
- `apps/management-web/src/components/EventsSortSelect.tsx`, `EventsLimitSelect.tsx` (new)
- `apps/management-web/src/app/(main)/events/page.tsx` (sort/limit, queryParams, show controls when no events)
- `packages/ui/src/components/Pagination/Pagination.tsx` (queryParams prop, buildPageUrl)
- `apps/management-web/i18n/originals/en-US.json`, `originals/es.json`, `overrides/es.json` (eventsSort, eventsSortOptions, eventsLimit)

---

### Session 4 - 2026-02-28

#### Prompt (Developer)

There should be a filter mechanism for the tables that Let's you search for case insensitive matches there should be a funnel icon button next to the filter search input mechanism that lets you check or uncheck which Table header columns you want the search to apply to

#### Key Decisions

- Added `TableFilterBar` in packages/ui: search input + funnel button that opens a popover with checkboxes per column; at least one column must remain selected.
- Filter is case-insensitive; applied client-side to the current page's rows. Row matches if any selected column's cell text includes the search string (trimmed, lowercased).
- Events and Admins pages: server builds `tableRows` (id + cells record) and `columns` (id + label); client components `EventsTableWithFilter` and `AdminsTableWithFilter` hold filter text (state) and selected columns (state, synced to URL via `filterColumns` query param). Pagination links preserve `filterColumns` (and sort for events).
- i18n: `common.tableFilter.placeholder`, `common.tableFilter.columnsLabel`, `common.tableFilter.funnelButtonLabel` in en-US, es, overrides/es.

#### Files Created/Modified

- `packages/ui/src/components/TableFilterBar/TableFilterBar.tsx`, `TableFilterBar.module.scss`, `index.ts`, `TableFilterBar.stories.tsx`
- `packages/ui/src/index.ts` (export TableFilterBar)
- `apps/management-web/src/components/EventsTableWithFilter.tsx`, `AdminsTableWithFilter.tsx` (new)
- `apps/management-web/src/app/(main)/events/page.tsx` (tableRows, eventColumns, filterColumns URL, EventsTableWithFilter)
- `apps/management-web/src/app/(main)/admins/page.tsx` (tableRows, adminColumns, filterColumns URL, AdminsTableWithFilter)
- `apps/management-web/i18n/originals/en-US.json`, `originals/es.json`, `overrides/es.json` (tableFilter keys)
