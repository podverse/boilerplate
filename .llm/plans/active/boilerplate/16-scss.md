# Plan 16: SCSS

## Scope

Enable SCSS and add minimal variables and/or mixins; keep import order so styles are last
(per podverse styles-import-last convention). **Shared UI package:** SCSS setup and
variables are implemented in (or consumed by) the shared package `packages/ui`
(`@boilerplate/ui`); both `apps/web` and `apps/management-web` import from the package.

## Steps

1. **Shared package**
   - Implement SCSS in the shared UI package (e.g. `packages/ui`) so both `apps/web` and
     `apps/management-web` consume the same variables and mixins. Add `sass` to the
     shared package; Next.js in each app supports `.scss` when sass is available.

2. **Global variables / mixins**
   - In the shared package: create `_variables.scss` and/or `_mixins.scss` for colors,
     spacing, breakpoints (plan 17). Optional mixins for clearfix, truncate, or responsive
     breakpoints. Export or expose so consuming apps import from the package.

3. **Import order**
   - Per podverse rule: in every component file, place style imports last (after React,
     other components, utils). Use ESLint/Prettier or documentation to enforce.

4. **Convert or add SCSS**
   - If existing CSS files exist, optionally convert one or two to SCSS to demonstrate (e.g.
     layout or a component). Or add a new `.module.scss` for a component and use it in the
     component with styles last.

5. **Documentation**
   - Short note in README or docs: SCSS is used; variables live in `src/styles/`; import
     order: styles last.

## Key files

- `packages/ui/` (sass dependency; `_variables.scss`, `_mixins.scss`); apps/web and
  apps/management-web consume from package
- README or style guide note

## Verification

- `npm run build` in apps/web succeeds; no SCSS compile errors.
- A page or component uses a SCSS module or global SCSS; styles apply. Lint passes with
  styles imported last.
