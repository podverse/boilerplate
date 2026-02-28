---
name: i18n-translations
description: How i18n translations work in the Boilerplate repo. Use when adding or editing translation keys, adding locales, or generating translations so you can do it reliably.
version: 1.0.0
---

# i18n in Boilerplate

Use this skill whenever you add or change user-facing strings, add a locale, or generate translations. It ensures key parity, correct file layout, and the right commands.

## Three-tier layout (per app or package)

Each app with i18n (`apps/web`, `apps/management-web`) and the backend package (`packages/helpers-i18n`) have:

- **`i18n/originals/`** — Source of truth. `en-US.json` is maintained by hand. Other locale files (e.g. `es.json`) must have the **exact same key structure** as `en-US.json` (values can be translated or placeholder).
- **`i18n/overrides/`** — Human corrections for non–en-US locales. Same keys as originals; non-empty override values win over originals at compile time. Committed.
- **`i18n/compiled/`** — Merged output (originals + overrides). Generated only; **do not commit** (in `.gitignore`). Used at runtime.

## Commands (run from repo root)

- **`npm run i18n:compile`** — For web, management-web, and **helpers-i18n**: sync override file structure from originals (new keys get empty string in overrides), then merge originals + overrides into compiled. Run after changing originals or overrides.
- **`npm run i18n:validate`** — Check that all locale files (originals + overrides) have the same keys as `en-US`, that `en-US` has no empty values, and that override structure matches. Validates web, management-web, and helpers-i18n. Fails the build if not. Run in CI and locally before committing i18n changes.

## Adding or changing keys

1. Edit **`i18n/originals/en-US.json`** in the app. Use nested keys and namespaces (e.g. `auth.login.title`, `common.loading`, `ui.auth.login.email`). Do **not** leave empty values in en-US.
2. **Other locales:** Every other file in `originals/` (e.g. `es.json`) and every file in `overrides/` must have the **same set of keys** as `en-US`. Add the new key to those files with a translated value (or temporary placeholder); for overrides you can use `""` if the original value is fine.
3. Run **`npm run i18n:compile`** then **`npm run i18n:validate`** to confirm.
4. In code: `useTranslations('auth')` then `t('login.title')`, or `useTranslations('ui')` then `t('auth.login.email')` for UI package keys.

## Key conventions

- **Namespaces:** `auth`, `common`, `dashboard`, `settings`, `errors`, **`ui`** (see below).
- **UI package:** Components in `@boilerplate/ui` that render their own text use the **`ui`** namespace. Each app must include a full **`ui`** object in its `i18n/originals/en-US.json` (and other locales). Required keys are listed in **`packages/ui/I18N-KEYS.md`**. When adding or changing UI strings, update that file and add the key to each app’s originals (and other locales).

## Generating translations (other locales)

There is **no built-in auto-translate**. Translations for non–en-US locales can be generated with an **LLM of your choosing** (e.g. Cursor chat): provide `en-US.json` (or the relevant namespace) and ask for a translation that preserves the exact JSON key structure and only changes string values. Then:

1. Write the result to the correct `i18n/originals/<locale>.json` (or use overrides for corrections).
2. Run **`npm run i18n:compile`** and **`npm run i18n:validate`** to ensure key parity and compile.

## Validation rules (what i18n:validate enforces)

- `en-US.json` exists in originals and has no empty or undefined values.
- Every other file in `originals/` has exactly the same keys as `en-US` (no missing, no extra).
- Every file in `overrides/` has exactly the same keys as `en-US`.

## Locale list and environment variables

Locale list and default are defined once in **`packages/helpers/src/locale/constants.ts`** (`ALL_AVAILABLE_LOCALES`, `DEFAULT_LOCALE`, `Locale`). Web and management-web import from `@boilerplate/helpers`; backend (helpers-i18n) re-exports from helpers. Runtime behavior is filtered by env vars `DEFAULT_LOCALE` and `SUPPORTED_LOCALES`.

### Sync points (all locations to update when adding a locale or changing default/supported)

| Purpose | File |
|--------|------|
| Locale constants (single source of truth) | `packages/helpers/src/locale/constants.ts` — `ALL_AVAILABLE_LOCALES`, `DEFAULT_LOCALE`. Web, management-web, and helpers-i18n use these via `@boilerplate/helpers`. |
| Web: env var documentation | `apps/web/.env.example` — `DEFAULT_LOCALE`, `SUPPORTED_LOCALES` |
| Management-web: env var documentation | `apps/management-web/.env.example` — `DEFAULT_LOCALE`, `SUPPORTED_LOCALES` |

- **`DEFAULT_LOCALE`** (env) — Overrides the default locale (e.g. `en-US`). Must be one of the values in that app’s `ALL_AVAILABLE_LOCALES`.
- **`SUPPORTED_LOCALES`** (env) — Unset or `all-available`: use the full hardcoded list. Comma-delimited (e.g. `en-US,es`): only those locales are active; values must be in `ALL_AVAILABLE_LOCALES`.

**When you add a new locale** (e.g. `fr`): add the locale to **`packages/helpers/src/locale/constants.ts`** (`ALL_AVAILABLE_LOCALES`). Then add `originals/fr.json` and (after compile) `overrides/fr.json` for each app and for `packages/helpers-i18n`, and run compile and validate. Web and management-web read the list from `@boilerplate/helpers`; no need to edit their request.ts. Ensure each app's `.env.example` documents `DEFAULT_LOCALE` and `SUPPORTED_LOCALES` if you rely on them.

## Where things live

| Item                             | Location                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| App originals                    | `apps/<app>/i18n/originals/` (e.g. `en-US.json`, `es.json`)                          |
| App overrides                    | `apps/<app>/i18n/overrides/` (e.g. `es.json`)                                        |
| App compiled                     | `apps/<app>/i18n/compiled/` (generated; do not edit)                                 |
| App locale list / request config | `apps/<app>/src/i18n/request.ts` (hardcoded `ALL_AVAILABLE_LOCALES`; align with env) |
| Backend i18n (API / management-api) | `packages/helpers-i18n/` — same originals/overrides/compiled; `resolveLocale()`, `getPasswordValidationMessages()`, email content helpers. User-facing messages only (password validation, email body). |
| Locale constants (all apps + backend) | `packages/helpers/src/locale/constants.ts`; import from `@boilerplate/helpers` everywhere. |
| UI keys reference                | `packages/ui/I18N-KEYS.md`                                                           |
| Full doc                         | `docs/localization/I18N.md`                                                          |

## Quick checklist when you add or change strings

- [ ] Add or edit key in `apps/<app>/i18n/originals/en-US.json` (no empty values).
- [ ] If the string is from `@boilerplate/ui`, add/update key in `packages/ui/I18N-KEYS.md` and ensure each app’s `ui` object has it.
- [ ] Add the same key to every other locale in `originals/` (and to `overrides/` if present) with a value (translated or placeholder).
- [ ] Run `npm run i18n:compile` and `npm run i18n:validate`.
- [ ] Use `useTranslations('namespace')` and `t('key')` in code (or pass translated strings as props from app to UI components).

When **adding a new locale** (e.g. `fr`): add the locale to **`packages/helpers/src/locale/constants.ts`** (`ALL_AVAILABLE_LOCALES`). Web and management-web import from `@boilerplate/helpers`; helpers-i18n re-exports from helpers. Then add originals/overrides for the new locale in each app and in helpers-i18n (see **Sync points** above).
