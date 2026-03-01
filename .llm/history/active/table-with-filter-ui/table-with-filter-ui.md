# TableWithFilter shared UI component

**Started:** 2025-02-28  
**Context:** Use a single UI component TableWithFilter for AdminsTableWithFilter and EventsTableWithFilter to improve consistency and reduce file sizes.

---

### Session 1 - 2025-02-28

#### Prompt (Developer)

adminstablewithfilter and eventstablewithfilter should both use a ui component named TableWithFilter to improve consistency and reduce file sizes

#### Key Decisions

- Added `TableWithFilter` in `packages/ui` with shared logic: filter state, debounced URL push, column picker, table rendering, pagination. Optional `extraPaginationParams` for Events (sort=oldest).
- AdminsTableWithFilter and EventsTableWithFilter are thin wrappers that pass props to TableWithFilter; they keep their existing prop types for backward compatibility.
- Removed duplicate SCSS from management-web; styles live in `TableWithFilter.module.scss` in ui.
- Storybook: added mock for `next/navigation` in `.storybook/mocks/next-navigation.ts` and alias in viteFinal so TableWithFilter (and other Next-dependent components) work in Storybook. Added TableWithFilter.stories.tsx.

#### Files Created/Modified

- packages/ui/src/components/TableWithFilter/TableWithFilter.tsx (new)
- packages/ui/src/components/TableWithFilter/TableWithFilter.module.scss (new)
- packages/ui/src/components/TableWithFilter/index.ts (new)
- packages/ui/src/components/TableWithFilter/TableWithFilter.stories.tsx (new)
- packages/ui/src/index.ts (export TableWithFilter and types)
- packages/ui/.storybook/mocks/next-navigation.ts (new)
- packages/ui/.storybook/main.ts (viteFinal alias for next/navigation)
- apps/management-web/src/components/AdminsTableWithFilter.tsx (refactored to use TableWithFilter)
- apps/management-web/src/components/EventsTableWithFilter.tsx (refactored to use TableWithFilter)
- apps/management-web: deleted AdminsTableWithFilter.module.scss, EventsTableWithFilter.module.scss
