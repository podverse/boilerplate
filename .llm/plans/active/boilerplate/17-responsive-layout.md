# Plan 17: Responsive layout

## Scope

Add a basic responsive layout: main content area and optional sidebar or header/footer.
Breakpoints for small, medium, and large viewports. Minimal styling; functionality and
clarity.

## Steps

1. **Breakpoints**
   - Define breakpoints (e.g. small &lt; 768px, medium 768–1024px, large &gt; 1024px) in SCSS
     variables (plan 16) or in a layout config. Use consistent values across components.

2. **Layout structure**
   - Root layout (e.g. `apps/web/src/app/layout.tsx`): header (optional), main content
     wrapper, optional sidebar, footer (optional). Use semantic HTML (header, main, aside,
     footer). For boilerplate, a simple header + main is enough.

3. **Responsive behavior**
   - Header: stack or collapse on small screens (e.g. hamburger or single row); full nav on
     larger. Main: full width on small, max-width centered on large. Sidebar (if any): hide
     or below main on small; beside main on medium+.

4. **CSS/SCSS**
   - Use media queries (or mixins from plan 16) to apply different padding, flex/grid, or
     visibility. Prefer mobile-first: base styles for small, then min-width for medium and
     large.

5. **Content**
   - Ensure dashboard (plan 22) and settings (plan 20) render inside this layout; no
     horizontal scroll on small viewports; touch-friendly where appropriate.

## Key files

- `apps/web/src/app/layout.tsx`
- Layout-related SCSS (e.g. `layout.module.scss`, or in global styles)
- Breakpoint variables in `_variables.scss` or equivalent

## Verification

- Resize browser or use devtools device toolbar; layout adapts at defined breakpoints.
- No horizontal overflow on 320px width; main content readable on all sizes.
