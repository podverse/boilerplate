# Plan 20: Settings page (i18n and theme)

## Scope

Add a settings page where the user can select locale (i18n) and theme (light/dark). Persist
choices in localStorage or, when available, user preferences (e.g. API-backed profile).
Uses i18n (plan 21) and theme context (plan 18); uses basic components (plan 19). The
settings page is **protected**: redirect unauthenticated users to /login (same as dashboard).

## Steps

1. **Route**
   - Add page at e.g. `apps/web/src/app/settings/page.tsx`. Protect it: redirect
     unauthenticated users to /login (use the same auth check as dashboard in plan 22).

2. **Locale selector**
   - Dropdown or radio list of available locales (from plan 21). On change: update i18n
     locale (e.g. switch next-intl locale or router with locale segment); persist in
     localStorage (e.g. key `locale`) so next load uses it.

3. **Theme selector**
   - Toggle or select: Light / Dark. On change: call setTheme from ThemeContext (plan 18);
     persist in localStorage (e.g. key `theme`) so next load uses it. Theme provider
     should read from localStorage on init.

4. **Layout**
   - Use Card and layout from plan 19 and 17; label sections "Language" and "Theme". Minimal
     styling; clear labels.

5. **Persistence**
   - Read locale and theme from localStorage on app init (in layout or providers); apply
     before first paint if possible to avoid flash. Settings page writes back on change.

6. **Optional: user profile**
   - If user is logged in and API supports user preferences, optional: save locale/theme to
     user profile and sync on login. For boilerplate, localStorage is sufficient.

## Key files

- `apps/web/src/app/settings/page.tsx`
- Integration with i18n (locale setter + persistence)
- Integration with ThemeContext (setTheme + persistence)
- Optional: user preferences API and sync

## Verification

- Unauthenticated users visiting /settings are redirected to /login. After login, visiting
  /settings shows locale and theme controls; changing them updates the app immediately and
  persists; after reload, saved values are applied.
