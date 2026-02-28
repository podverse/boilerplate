# i18n translations audit – Summary

## Scope

1. **Scan** all current pages and components (apps/web, apps/management-web, packages/ui) for
   user-facing text and ensure they use i18n translations (e.g. `t()` or `useTranslations`)
   instead of hardcoded strings.
2. **Harden** the i18n process so it is efficient and reliable: key conventions, validation
   (same keys across locales, no empty originals), compile/sync steps, and CI integration.

Assumes the base i18n setup exists or is added per plan 21 (three-tier originals/overrides/
compiled, next-intl or next-i18next, locale persistence). This plan focuses on coverage and
process quality.

## Target areas

- **apps/web** – All pages under `app/` (auth: login, signup, forgot-password, reset-password;
  main: dashboard, settings, etc.) and app-level components (e.g. AppHeader).
- **apps/management-web** – All pages (auth, main: dashboard, admins, events, settings) and
  components (e.g. AppHeader).
- **packages/ui** – Shared components that render user-facing text (forms, buttons, labels,
  placeholders, error messages). Either accept translation keys or labels as props from the
  app, or use a shared i18n provider/context so the UI package can call `t()` without
  depending on a specific app.

## Plan files

| ID | File | Description |
| --- | --- | --- |
| – | 00-EXECUTION-ORDER.md | Phase order and pointers |
| – | 00-SUMMARY.md | This file |
| 01 | 01-i18n-audit-and-process.md | Audit pages/components; fix gaps; efficient/reliable process |

## Dependency map

- **01** depends on an existing i18n setup (plan 21 or equivalent): config, originals/
  overrides/compiled layout, and `t()`/useTranslations usage pattern. The audit can still run
  to produce a list of files and strings to fix before or after plan 21 is complete.

## Decisions (to be recorded during implementation)

- How shared UI components get translated: props (labels from app) vs provider/context in
  app that UI consumes.
- Key naming convention (e.g. `auth.login.title`, `settings.theme.dark`) and namespace
  split (per-app vs shared).
- Validation rules: no empty values in originals; all locales have same keys; compile fails
  on missing keys.
- Whether to add an automated scan (e.g. script or ESLint plugin) to detect hardcoded
  strings in TSX/JSX.
