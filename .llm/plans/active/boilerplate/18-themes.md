# Plan 18: Themes (dark and light)

## Scope

Add theme support: light and dark mode. Use a theme context (React) and CSS variables (or
SCSS variables) so components can switch. Toggle stored in state; persistence (e.g.
localStorage) can be added in plan 20 (settings page).

## Steps

1. **Theme context**
   - Create a ThemeContext (or use a small state library): current theme 'light' | 'dark',
     setTheme function. Provide at app root (e.g. in layout or a providers wrapper).

2. **CSS variables**
   - Define a set of variables for colors (background, text, border, primary, etc.) in two
     sets: light and dark. Apply to :root or a wrapper div (e.g. data-theme="light" |
     data-theme="dark"). Switch the set when theme changes.

3. **Initial value**
   - Default theme: light (or read from localStorage if available). On first load, optional:
     respect prefers-color-scheme (match system) then allow override.

4. **Apply in layout**
   - Root layout (or theme provider component) renders a wrapper with className or
     data-theme based on context; all pages inherit variables. Use the same variable names
     in components (plan 19) so switching theme updates the whole app.

5. **Toggle**
   - Expose a toggle (button or control) that calls setTheme; can live in header or layout
     for now. Settings page (plan 20) will add a dedicated theme selector and persistence.

## Key files

- `apps/web/src/contexts/ThemeContext.tsx` (or providers/theme.tsx)
- Global SCSS or CSS with [data-theme="light"] and [data-theme="dark"] variable sets
- Layout or provider that wraps app with theme state
- Optional: small ThemeToggle component in header

## Verification

- Toggling theme updates the UI (background and text colors change); no flash of wrong
  theme on load if persisted. Context value is consistent across the tree.
