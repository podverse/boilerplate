# Settings Form Max-Width

**Started:** 2026-03-02
**Context:** Wrap settings pages in FormContainer so max-width rules are applied.

### Session 1 - 2026-03-02

#### Prompt (Developer)

the settings page on boilerplate web and manaagement-web needs to be wrapped in the form so that the max-width rules are applied

#### Key Decisions

- Wrapped the `Stack` content in both settings pages with `FormContainer` using a no-op
  `onSubmit` handler, since settings controls apply changes immediately via `onChange`.
- `constrainWidth` defaults to `true` so `$input-max-width` is applied automatically.

#### Files Created/Modified

- apps/web/src/app/(main)/settings/SettingsContent.tsx
- apps/management-web/src/app/(main)/settings/SettingsContent.tsx

### Session 2 - 2026-03-02

#### Prompt (Developer)

the Selects on the Settings for web and management-web do not need to be wrapped in Card. they
should just be normal selects with labels

#### Key Decisions

- Removed inner `Card` wrappers around `ThemeSelector` and `Select` in both settings pages.
- Added `label` prop support to `ThemeSelector` so the settings page can pass the translated label.
- Changed `Select` for locale to use the `label` prop directly instead of `aria-label`
  (the `Select` component renders a visible `<label>` when the prop is provided).

#### Files Created/Modified

- packages/ui/src/components/navigation/ThemeSelector/ThemeSelector.tsx
- apps/web/src/app/(main)/settings/SettingsContent.tsx
- apps/management-web/src/app/(main)/settings/SettingsContent.tsx
