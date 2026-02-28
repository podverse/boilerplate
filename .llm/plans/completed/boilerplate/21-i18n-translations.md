# Plan 21: i18n translations

## Scope

Set up i18n (e.g. next-intl or next-i18next) with at least two locales. Add translation keys
for login, signup, dashboard, settings, and messages. Used by settings page (plan 20) and
throughout the app. Management-web (plan 33) may share the same i18n layout
(originals/overrides/compiled) or use a dedicated namespace for management UI; keep keys
consistent if shared. **Translations:** Three-tier layout (originals → overrides → compiled). There is no built-in
auto-translate workflow; translations for other locales can be generated with an LLM of your
choosing (e.g. Cursor chat) or manually. See `docs/localization/I18N.md`.

## Steps

1. **Library and config**
   - Choose next-intl or next-i18next (or Next.js i18n routing). Install and configure in
     Next.js (middleware or next.config for locale detection and routing). Define default
     locale and list of supported locales (e.g. en, es or en, fr).

2. **Translation files (three-tier, Podverse-aligned)**
   - **originals/** – Source translations. `en-US.json` (or equivalent) is manually
     maintained; other locales can be LLM-generated. Paths e.g.
     `apps/web/i18n/originals/en-US.json`, `apps/web/i18n/originals/es.json`.
   - **overrides/** – Human corrections to LLM output. Empty defaults; only non-empty
     values override. One file per non–source locale, e.g. `apps/web/i18n/overrides/es.json`.
   - **compiled/** – Final merged output used by the app. Generated at build time; **do not
     commit**. Add to .gitignore. Build step merges originals + overrides into compiled.
   - Structure keys for auth (login, signup, logout), dashboard (title, postMessage,
     messagesList), settings (title, language, theme), common (submit, cancel, error).

3. **Keys**
   - Auth: login.title, login.email, login.password, login.submit, signup.title,
     signup.confirmPassword, signup.submit, logout.
   - Dashboard: dashboard.title, dashboard.postPlaceholder, dashboard.send, dashboard.messages,
     dashboard.empty, dashboard.privacyToggle.
   - Settings: settings.title, settings.language, settings.theme, settings.themeLight,
     settings.themeDark.
   - Common: errors.required, errors.invalidEmail, etc.

4. **Commands**
   - **i18n:compile** – Sync override file structure with originals (new keys get empty
     values) and generate compiled output.
   - **i18n:validate** – Check all i18n files (same keys, no empty originals, etc.). Used
     in CI.
   - Translations for other locales: use an LLM of your choosing (e.g. Cursor chat) or
     manual translation; keep key parity with en-US, then run compile and validate.

5. **Usage in components**
   - Use the library's hook or HOC (e.g. useTranslations('auth')) in login, signup,
     dashboard, settings. Replace hardcoded strings with t('key'). Ensure server and client
     components use the correct API (next-intl supports both).

6. **Locale persistence**
   - Plan 20 (settings) will persist selected locale; ensure the i18n provider or router
     reads initial locale from localStorage or cookie so the first render uses saved locale
     when possible.

7. **Documentation**
   - Add `docs/localization/I18N.md` (or equivalent): describe the three tiers
     (originals/overrides/compiled), the commands (i18n:compile, i18n:validate), and that
     translations for other locales can be generated with an LLM of your choosing (e.g.
     Cursor chat) or manually.

## Key files

- `apps/web` i18n config (next.config, middleware, or provider)
- `apps/web/i18n/originals/en-US.json` (and other locales)
- `apps/web/i18n/overrides/<locale>.json`
- `apps/web/i18n/compiled/` (generated, gitignored)
- `docs/localization/I18N.md`
- Login, signup, dashboard, settings components updated to use t()

## Verification

- Switching locale in settings changes all translated strings; at least two locales work.
- Keys used in app exist in translation files; no missing-key warnings in dev (or
  intentional fallback to key).
- Adding or changing keys in originals and generating other locales (via Cursor or another
  LLM, or manually) then running `i18n:compile` and `i18n:validate` succeeds.
