# Plan 21: i18n translations

## Scope

Set up i18n (e.g. next-intl or next-i18next) with at least two locales. Add translation keys
for login, signup, dashboard, settings, and messages. Used by settings page (plan 20) and
throughout the app.

## Steps

1. **Library and config**
   - Choose next-intl or next-i18next (or Next.js i18n routing). Install and configure in
     Next.js (middleware or next.config for locale detection and routing). Define default
     locale and list of supported locales (e.g. en, es or en, fr).

2. **Translation files**
   - Create JSON or similar files per locale (e.g. `apps/web/messages/en.json`,
     `messages/es.json` or under `public/locales/`). Structure: namespaces or flat keys for
     auth (login, signup, logout), dashboard (title, postMessage, messagesList),
     settings (title, language, theme), common (submit, cancel, error).

3. **Keys**
   - Auth: login.title, login.email, login.password, login.submit, signup.title,
     signup.confirmPassword, signup.submit, logout.
   - Dashboard: dashboard.title, dashboard.postPlaceholder, dashboard.send, dashboard.messages,
     dashboard.empty, dashboard.privacyToggle.
   - Settings: settings.title, settings.language, settings.theme, settings.themeLight,
     settings.themeDark.
   - Common: errors.required, errors.invalidEmail, etc.

4. **Usage in components**
   - Use the library’s hook or HOC (e.g. useTranslations('auth')) in login, signup,
     dashboard, settings. Replace hardcoded strings with t('key'). Ensure server and client
     components use the correct API (next-intl supports both).

5. **Locale persistence**
   - Plan 20 (settings) will persist selected locale; ensure the i18n provider or router
     reads initial locale from localStorage or cookie so the first render uses saved locale
     when possible.

## Key files

- `apps/web` i18n config (next.config, middleware, or provider)
- `apps/web/messages/en.json` (and at least one other locale)
- Login, signup, dashboard, settings components updated to use t()

## Verification

- Switching locale in settings changes all translated strings; at least two locales work.
- Keys used in app exist in translation files; no missing-key warnings in dev (or
  intentional fallback to key).
