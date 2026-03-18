# 10b – Storybook

## Scope

Update all Storybook stories so they align with current components, document props, and cover key
states. Align with the storybook-component-docs skill if present.

## Steps

### 1. Storybook story inventory

- List all components under `packages/ui` (or wherever Storybook sources from) that are part of
  the public UI API. For each, check if a corresponding `*.stories.tsx` (or equivalent) exists.
- Note components that have no story or a story that is outdated (e.g. old props, missing
  variants).

### 2. Update or add Storybook stories

- For each component that needs work:
  - Ensure the story file imports and renders the component with realistic props.
  - Document props (e.g. via JSDoc, Storybook controls, or args) so that key options are
    visible and editable in the Storybook UI.
  - Add stories for key states: default, loading, error, disabled, empty, etc., where
    applicable. Follow the storybook-component-docs skill (e.g. required vs optional props,
    primary variants).
- Fix any broken stories (e.g. missing exports, wrong import path, deprecated Storybook API).
  Ensure Storybook builds successfully (`npm run storybook` or the project’s command).

### 3. Verify

- Storybook builds and runs; all stories render without errors. Key components have at least one
  story that reflects current behavior.

## Key files

- `packages/ui/src/**/*.tsx` and `packages/ui/src/**/*.stories.tsx`
- Storybook config (e.g. `.storybook/main.ts`, `main.js`)
- `.cursor/skills/storybook-component-docs/SKILL.md` (if present)

## Verification

- Storybook builds; stories exist and are up to date for the main UI components; props and key
  states are documented.
