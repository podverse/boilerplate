# i18n translation handling

**Started:** 2025-02-27  
**Context:** Implement i18n across boilerplate per plan (three-tier originals/overrides/compiled, next-intl in apps and UI package).

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

implement plan

#### Key Decisions

- Three-tier i18n: originals (en-US.json) and overrides per app; compiled generated at build, not committed.
- Root scripts: `scripts/i18n/compile.mjs` and `scripts/i18n/validate.mjs`; each app runs compile via prebuild and dev.
- next-intl in apps/web and apps/management-web: getRequestConfig loads from compiled, NextIntlClientProvider in root layout, locale from cookie/Accept-Language, default en-US.
- UI package: next-intl peer + devDep; LoginForm, ForgotPasswordForm, SignupForm, ResetPasswordForm, AppHeader, PasswordStrengthMeter, FormLinks use `useTranslations('ui')`; apps supply full `ui` namespace in originals.
- Storybook remains out of scope for i18n (no provider or bundle).
- Messages type: cast loaded JSON to `AbstractIntlMessages` (use-intl/core) in request.ts for type compatibility.
- npm install may require `--legacy-peer-deps` until next-intl officially supports Next 16; documented in I18N.md.

#### Files Created/Modified

- `scripts/i18n/compile.mjs`, `scripts/i18n/validate.mjs`
- `apps/web/i18n/originals/en-US.json`, `apps/management-web/i18n/originals/en-US.json`
- `.gitignore` (compiled dirs)
- `package.json` (root: i18n:compile, i18n:validate; apps: i18n:compile, prebuild, dev runs compile)
- `apps/web/next.config.ts`, `apps/management-web/next.config.ts` (createNextIntlPlugin)
- `apps/web/src/i18n/request.ts`, `apps/management-web/src/i18n/request.ts`
- `apps/web/src/app/layout.tsx`, `apps/management-web/src/app/layout.tsx` (NextIntlClientProvider)
- `apps/web/package.json`, `apps/management-web/package.json` (next-intl, prebuild, dev)
- `packages/ui/package.json` (next-intl peer + devDep)
- UI: LoginForm, ForgotPasswordForm, SignupForm, ResetPasswordForm, AppHeader, PasswordStrengthMeter, FormLinks (useTranslations)
- apps/web: AppHeader, dashboard, settings, main page, auth pages (useTranslations; error keys from errors namespace)
- apps/management-web: AppHeader, dashboard, settings, main, login (useTranslations)
- `.github/workflows/ci.yml` (i18n validate step)
- `docs/localization/I18N.md`, `packages/ui/I18N-KEYS.md`

---

### Session 2 - 2025-02-27

#### Prompt (Developer)

Add the ability to set a default locale As an environment variable in any app that uses I eighteen N Translations also add the ability to Set supported locales as an environment variable While it will be hard-coded in the code what locales are potentially supported The environment variable can reduce the locales that will appear in the app. The default value for the supported locales environment variable should be all dash available If that is not set, then the user must specify a concatenated comma delimited list of locales the default default locale is en US

#### Key Decisions

- `DEFAULT_LOCALE`: env var; default `en-US` when unset. Must be in hardcoded `ALL_AVAILABLE_LOCALES` or fallback to en-US.
- `SUPPORTED_LOCALES`: env var; default `all-available` (or unset) = use all hardcoded locales; else comma-delimited list, filtered to only locales in `ALL_AVAILABLE_LOCALES`.
- Effective default in detectLocale: if default locale not in supported list, use first supported locale.

#### Files Created/Modified

- `apps/web/src/i18n/request.ts`, `apps/management-web/src/i18n/request.ts` (getDefaultLocale, getSupportedLocales, ALL_AVAILABLE_LOCALES)
- `apps/web/.env.example` (DEFAULT_LOCALE, SUPPORTED_LOCALES)
- `apps/management-web/.env.example` (new file with PORT, DEFAULT_LOCALE, SUPPORTED_LOCALES)
- `docs/localization/I18N.md` (locale detection section)
