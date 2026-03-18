# 03 – Reusable elements review

## Scope

Review and consolidate: SCSS mixins, design primitives (tokens/base components), `packages/ui`
structure, shared types, and repeated state patterns that could become reusable hooks. Goal is
documented structure, fewer duplicates, and new hooks only where clearly beneficial.

## Steps

### 1. SCSS mixins

- List all SCSS files that define mixins (e.g. `@mixin ...`) in apps and in `packages/ui`. To
  list mixin definitions: `grep -r '@mixin' --include='*.scss' packages/ui apps/web
  apps/management-web`.
- For each mixin, note where it is used (file and purpose).
- Identify duplicate or near-duplicate mixins (e.g. same flex center, same focus ring); consolidate
  into a single source (e.g. shared mixins file or design tokens).
- Update all consumers to use the consolidated mixin; remove the duplicates.

### 2. Primitives (design tokens, base components)

- List design tokens (colors, spacing, typography) and where they are defined (e.g. SCSS vars,
  CSS custom properties, theme object).
- Ensure a single source of truth; if the same token is defined in multiple places, centralize
  and re-export.
- List “primitive” or base UI components (e.g. Button, Text, Icon) and confirm they live in
  `packages/ui` and are not duplicated in apps.

### 3. packages/ui structure

- Review `packages/ui/src/`: form, layout, modal, table, navigation, feedback, etc.
- Document the intended grouping (e.g. form = form controls; layout = page structure; modal =
  overlays; table = data tables).
- Identify any component that is in the “wrong” group or that could be merged with another;
  move or merge and update exports/docs.

### 4. Shared types

- Review types in `packages/helpers`, `packages/helpers-requests`, and `packages/orm` that are
  used for API/validation or shared DTOs.
- Identify duplication (e.g. same shape defined in api and management-api, or in helpers and
  helpers-requests); consolidate into a single definition and re-export where needed.
- Ensure no circular dependency is introduced.

### 5. State patterns and hooks

- Identify repeated state patterns in apps and packages: e.g. modal open/close, list selection,
  async submit + loading + error, pagination state.
- For each pattern used in more than one place, decide whether a shared hook is justified (clear
  reuse, simpler call sites). If yes, extract to a hook in an appropriate package (e.g.
  `packages/ui` for UI state, app lib for app-specific logic).
- Document the new hooks and where to use them.

### 6. Document and verify

- Update or add a short doc (e.g. in AGENTS.md or packages/ui README) describing: mixin/token
  location, UI package structure, and where to put new primitives/hooks.
- Run lint and build; ensure no broken imports or types.

## Key files

- `packages/ui/src/` (all components and styles)
- `packages/helpers/`, `packages/helpers-requests/` (types and DTOs)
- App-level hooks and types (e.g. `apps/web/src/lib/`, `apps/management-web/src/`)
- SCSS files that define or use mixins and tokens

## Verification

- Mixins and design tokens have a single source; duplicates removed.
- packages/ui structure is documented; components are in the right groups.
- Shared types consolidated where appropriate; no new circular deps.
- New hooks only where reuse is clear; documented.
- `npm run lint` and `npm run build` pass.
