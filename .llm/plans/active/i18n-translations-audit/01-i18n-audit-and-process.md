# Plan 01: i18n audit and process reliability

## Scope

1. **Audit** every page and component that renders user-facing text and ensure they use i18n
   (e.g. `t('key')` or `useTranslations('namespace')`) instead of hardcoded strings.
2. **Improve** the i18n process for efficiency and reliability: key conventions, validation,
   compile/sync, and CI.

Assumes the repo has (or will have) an i18n setup per plan 21: originals → overrides →
compiled, and a translation API (e.g. next-intl) used in apps and optionally in the shared
UI package.

## Steps

### 1. Inventory pages and components

- **apps/web:** List all routes under `src/app/` (e.g. (auth)/login, signup, forgot-password,
  reset-password; (main)/dashboard, settings, etc.) and any shared components under
  `src/components/` (e.g. AppHeader, AuthWrapper).
- **apps/management-web:** Same: all routes under `src/app/` and `src/components/`.
- **packages/ui:** List components that render user-visible text: auth forms (LoginForm,
  SignupForm, ForgotPasswordForm, ResetPasswordForm), Form, Button, Input (placeholders,
  labels), AppHeader, ThemeSelector, Link, Text, error/validation messages, etc. Note
  whether they currently take string props from the app or render hardcoded English.

Produce a checklist (file path + short description) of every place that should use
translations.

### 2. Define translation strategy for shared UI

- **Option A (props):** Apps pass translated strings as props (e.g. `title={t('auth.login.title')}`).
  UI package stays locale-agnostic; no i18n dependency in packages/ui.
- **Option B (context/provider):** Apps wrap UI in an i18n provider; UI components call
  `useTranslations()` or receive `t` via context. Requires the UI package to depend on the
  same i18n library or a thin adapter.

Choose one approach and document it. Ensure all shared components that show text either
receive translated strings from the app or use the chosen mechanism.

### 3. Audit apps/web and apps/management-web

- For each page and component in the inventory, open the file and find every user-facing
  string (labels, titles, placeholders, buttons, error messages, links).
- Mark each as: **uses t()** (or equivalent) or **hardcoded**. Record missing keys (e.g.
  "Login" → should be `t('auth.login.title')` or similar).
- Add missing keys to the originals file (e.g. `apps/web/i18n/originals/en-US.json` and
  equivalent for management-web if it has its own namespace or app-specific file).
- Replace hardcoded strings with `t('key')` (or the chosen API). Ensure server vs client
  usage follows the library’s rules (e.g. getTranslations on server, useTranslations on
  client for next-intl).

### 4. Audit packages/ui

- For each component that renders text, either:
  - **Props approach:** Ensure the component accepts props for all user-visible strings
    (title, submitLabel, placeholder, etc.) and that apps pass `t('...')` for each. Remove
    any default hardcoded strings or document them as fallbacks only when prop is omitted.
  - **Provider approach:** Ensure the component uses `useTranslations()` (or injected `t`)
    and replace hardcoded strings with keys. Add those keys to a shared namespace or to
    each app’s originals if UI keys are app-owned.
- Storybook stories: Prefer passing translated strings as props in stories (or mock `t` in
  provider) so stories don’t depend on a real locale bundle; document in component docs.

### 5. Key conventions and namespacing

- Document key structure: e.g. `auth.login.title`, `auth.signup.email`, `settings.theme.dark`,
  `common.submit`, `common.cancel`, `errors.required`. Decide whether management-web shares
  the same keys (e.g. `auth.login.title`) or uses a prefix (e.g. `management.auth.login.title`).
- Ensure keys are consistent across locales: same set in en-US and every other locale (originals
  + overrides). New keys added to originals must be synced to overrides (empty or translated)
  and validated.

### 6. Validation and scripts

- **i18n:validate** (or equivalent): Run in CI and locally. Checks: (1) all locale files have
  the same keys; (2) no empty or missing values in originals (en-US); (3) compiled output
  can be generated without errors. Fail the build or script if any check fails.
- **i18n:compile** (or equivalent): Sync override file structure with originals (add new keys
  with empty value for non-source locales), then merge originals + overrides → compiled.
  Idempotent and fast; no API key required.
- Translations for other locales: use an LLM of your choosing (e.g. Cursor chat) or manual
  translation; keep same keys as en-US, then run i18n:compile and i18n:validate.

### 7. CI and documentation

- Run `i18n:validate` (and optionally `i18n:compile`) in CI (e.g. on every push or in the
  same job as lint/build).
- Update docs (e.g. `docs/localization/I18N.md` or README): how to add a new key, where
  originals/overrides/compiled live, how to run compile/validate, and that all new user-
  facing strings must use `t()` and be added to originals. Mention the audit checklist
  (pages and components that must use i18n) so future changes stay consistent.

### 8. Optional: automated scan for hardcoded strings

- Consider a script or ESLint rule that flags likely hardcoded strings in TSX/JSX (e.g.
  JSX text nodes or string literals in certain props) and suggests using `t()`. This can
  be a best-effort heuristic to catch regressions; document limitations (e.g. no false
  positives on dynamic or non-user-facing strings).

## Key files

- **apps/web:** `src/app/**/*.tsx`, `src/components/**/*.tsx`; `i18n/originals/*.json`,
  `i18n/overrides/*.json`; next.config or i18n config.
- **apps/management-web:** Same structure if it has its own i18n; or shared keys in apps/web.
- **packages/ui:** All components that render text (auth forms, Form, Button, Input,
  AppHeader, ThemeSelector, etc.); no i18n files in UI package if using props-only strategy.
- **Root or app scripts:** `i18n:compile`, `i18n:validate` in package.json.
- **CI:** Run `i18n:validate` in the main workflow (e.g. lint/build job).
- **Docs:** `docs/localization/I18N.md` or equivalent.

## Verification

- After audit: no page or component in the inventory has hardcoded user-facing strings
  (except where explicitly documented, e.g. Storybook fallbacks).
- `npm run i18n:validate` passes; `npm run i18n:compile` produces compiled files used at
  runtime.
- CI runs i18n validation and fails if keys are missing or originals have empty values.
- Documentation describes the process and key conventions; new contributors can add keys
  and use `t()` consistently.
