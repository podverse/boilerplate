# Plan 21: i18n translations

## Scope

Set up i18n (e.g. next-intl or next-i18next) with at least two locales. Add translation keys
for login, signup, dashboard, settings, and messages. Used by settings page (plan 20) and
throughout the app. **Automation:** Mirror Podverse: three-tier layout (originals → overrides
→ compiled), GitHub workflow on push to `develop` that updates translations and commits back;
when `OPENAI_API_KEY` is not set, the workflow skips the LLM translate step.

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
   - **i18n:translate** – LLM (e.g. OpenAI) translates originals to other locales. Requires
     `OPENAI_API_KEY` (or equivalent). Root script runs for apps that have i18n (e.g. web).
   - **i18n:compile** – Sync override file structure with originals (new keys get empty
     values) and generate compiled output. No API key needed.
   - **i18n:validate** – Check all i18n files (same keys, no empty originals, etc.). Used
     in CI and in the automation workflow.

5. **Usage in components**
   - Use the library’s hook or HOC (e.g. useTranslations('auth')) in login, signup,
     dashboard, settings. Replace hardcoded strings with t('key'). Ensure server and client
     components use the correct API (next-intl supports both).

6. **Locale persistence**
   - Plan 20 (settings) will persist selected locale; ensure the i18n provider or router
     reads initial locale from localStorage or cookie so the first render uses saved locale
     when possible.

7. **Automation: GitHub Actions workflow (`.github/workflows/i18n.yml`)**
   - **Trigger:** `on.push.branches: [develop]` with `paths: ['apps/web/i18n/originals/en-US.json']`
     (or `apps/*/i18n/originals/en-US.json` if multiple apps).
   - **Skip when OpenAI API key is not set:** Add a step that sets an output (e.g.
     `skip_translate`) without echoing the secret: if `OPENAI_API_KEY` is empty, set
     `skip_translate=true`; else `skip_translate=false`. The “Run i18n translations” step
     uses `if: steps.check.outputs.skip_translate != 'true'`. When the key is not
     configured, the translate step is skipped; `i18n:compile` and `i18n:validate` still run.
   - **Steps:** Checkout (with token that can push, e.g. GitHub App token or
     `GITHUB_TOKEN` with repo permissions), Node 24, `npm ci`, `npm run build:packages`,
     conditional translate step, `npm run i18n:compile`, `npm run i18n:validate`, then
     commit and push to `develop` only `originals/` and `overrides/` with message e.g.
     `chore: auto-generate i18n translations [skip ci]`. Concurrency: queue pushes to
     develop (do not cancel in progress).

8. **Documentation**
   - Add `docs/localization/I18N.md` (or equivalent): describe the three tiers
     (originals/overrides/compiled), the commands, and that if `OPENAI_API_KEY` is not set,
     the workflow runs but skips the LLM translate step.

## Key files

- `apps/web` i18n config (next.config, middleware, or provider)
- `apps/web/i18n/originals/en-US.json` (and other locales)
- `apps/web/i18n/overrides/<locale>.json`
- `apps/web/i18n/compiled/` (generated, gitignored)
- `.github/workflows/i18n.yml`
- `docs/localization/I18N.md`
- Login, signup, dashboard, settings components updated to use t()

## Verification

- Switching locale in settings changes all translated strings; at least two locales work.
- Keys used in app exist in translation files; no missing-key warnings in dev (or
  intentional fallback to key).
- Pushing a change to `apps/web/i18n/originals/en-US.json` on `develop` triggers the
  workflow; when `OPENAI_API_KEY` is set, translations are generated and committed back;
  when not set, the translate step is skipped and the workflow still completes (compile +
  validate run).
