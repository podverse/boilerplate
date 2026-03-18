# 07 – i18n improvements

## Scope

Fix missing i18n translations (excluding Storybook stories), consolidate duplicate or redundant keys
across apps and packages/helpers-i18n, and audit all placeholder usage (e.g. `{{name}}`) for
correctness and consistency. Follow the repo’s i18n skill and scripts.

## Steps

### 1. Run i18n validation and list missing keys

- Run the project’s i18n validation script (e.g. `scripts/i18n/validate.mjs` or a Make/npm
  target). If there is no validation script, add a simple check that compares keys in originals
  (e.g. `en-US.json`) to keys used in app code (or vice versa). To find key usage: grep for
  `t('`, `t("`, `useTranslation`, and any project-specific i18n helpers; or run the i18n
  validation script if it reports missing keys.
- List all missing keys: keys used in code but not present in originals, or keys in originals
  that are required by a locale but missing in that locale’s file. Ignore keys that are only used
  in Storybook stories unless the story is part of the design system and should be translated.

### 2. Add missing translations

- For each missing key, add the key and value to the appropriate originals file (e.g.
  `apps/web/i18n/originals/en-US.json`, `apps/management-web/i18n/originals/en-US.json`,
  `packages/helpers-i18n/i18n/originals/en-US.json`). Add to other locales (e.g. `es`) or run
  sync script if the repo syncs from en-US.
- Apply overrides in `apps/*/i18n/overrides/` or `packages/helpers-i18n/i18n/overrides/` where
  locale-specific overrides are used. Ensure no key is left blank unintentionally.

### 3. Consolidate duplicate or redundant keys

- Compare keys across `apps/web`, `apps/management-web`, and `packages/helpers-i18n`. Identify
  keys that mean the same thing but are named differently (e.g. `common.save` vs `actions.save`),
  or the same key duplicated in multiple apps. Prefer a single source in helpers-i18n for shared
  strings; apps can override or add app-specific keys.
- After consolidation, update all references in code to use the chosen key; remove deprecated
  keys from originals once unused.

### 4. Audit placeholder usage

- Search for placeholders in i18n files (e.g. `{{name}}`, `{{count}}`, `{{email}}`). For each:
  - Confirm the placeholder name matches what the code passes when calling the translation
    function (e.g. `t('key', { name: user.name })`).
  - Ensure plural/select rules are correct where used (e.g. `count` for plurals).
  - Ensure no typos in placeholder names (e.g. `{{naem}}` → `{{name}}`).
- Document or fix any incorrect or inconsistent placeholders.

### 5. Re-run sync/compile and tests

- Run the i18n sync script (e.g. sync-originals-from-en-us) and compile script (e.g. compile)
  so that compiled JSON is up to date.
- Run the test suite; fix any test that expected old keys or placeholder behavior.
- Run validation again; it should pass (no missing keys except intentional omissions).

## Key files

- `apps/web/i18n/originals/`, `apps/web/i18n/overrides/`, `apps/web/i18n/compiled/`
- `apps/management-web/i18n/originals/`, `apps/management-web/i18n/overrides/`,
  `apps/management-web/i18n/compiled/`
- `packages/helpers-i18n/i18n/originals/`, `packages/helpers-i18n/i18n/overrides/`,
  `packages/helpers-i18n/i18n/compiled/`
- `scripts/i18n/validate.mjs`, `scripts/i18n/sync-originals-from-en-us.mjs`,
  `scripts/i18n/compile.mjs`
- `apps/web/src/i18n/request.ts`, `apps/management-web/src/i18n/request.ts`
- `.cursor/skills/i18n/SKILL.md` (follow its guidance)

## Verification

- No missing translation keys for app code (stories excluded unless required).
- Placeholders are correct and consistent; no typos.
- i18n validation script passes; sync and compile succeed.
- Tests and localization-related docs are updated if behavior changed.
