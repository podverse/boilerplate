# Plan 16: SCSS

## Scope

Enable SCSS in the Next.js app; add minimal variables and/or mixins; keep import order so
styles are last (per podverse styles-import-last convention).

## Steps

1. **Install dependency**
   - In `apps/web`: add `sass` (or `node-sass` if required by Next.js version). Next.js
     supports `.scss` and `.sass` when sass is installed.

2. **Global variables / mixins**
   - Create a small file (e.g. `apps/web/src/styles/_variables.scss` or
     `_mixins.scss`) with CSS variables or SCSS variables for colors, spacing, breakpoints
     (if used in plan 17). Optional mixins for clearfix, truncate, or responsive breakpoints.
   - Import this file in a global layout or in components that need it (or use
     next.js global CSS import for a single entry that only defines variables).

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

- `apps/web/package.json` (sass)
- `apps/web/src/styles/_variables.scss` (or similar)
- One or more `*.module.scss` or `*.scss` files in app
- README or style guide note

## Verification

- `npm run build` in apps/web succeeds; no SCSS compile errors.
- A page or component uses a SCSS module or global SCSS; styles apply. Lint passes with
  styles imported last.
