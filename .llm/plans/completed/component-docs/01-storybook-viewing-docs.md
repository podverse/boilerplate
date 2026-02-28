# Component viewing and documentation (Storybook)

Viewing and documentation only; no testing in scope.

## Goal

Add Storybook to `packages/ui` so developers can browse and document shared UI components in isolation (themes, variants, props) without running the full apps.

## Current state

- **`packages/ui`**: ~18 React components (Button, Card, Input, auth forms, ThemeProvider, etc.), SCSS modules, React 19.
- **Apps**: Next.js 16 (web, management-web). No existing component catalog or story tool.

## Why Storybook (vs Ladle)

- **Storybook**: De facto standard; good docs/addons (controls, a11y); works with Next and monorepos; room to grow (e.g. design tokens, more addons later).
- **Ladle**: Lighter and faster (Vite), CSF-compatible; better if you only want a minimal “component runner” with little config. Can adopt later and reuse CSF stories.

Recommendation: start with Storybook for viewing and documentation.

## Where it lives

- **Storybook**: In **`packages/ui`**. Stories sit next to the components they document; run via `npm run storybook` from that package or from root.

## Implementation steps

1. **Bootstrap Storybook in `packages/ui`**
   - From repo root: `./scripts/nix/with-env npx storybook@latest init` (or manual install of `@storybook/nextjs` or `@storybook/react-vite`, plus `storybook`).
   - Use **`@storybook/nextjs`** if you want Next-specific behavior (e.g. `next/head`) in stories; use **`@storybook/react-vite`** for a lighter, faster dev server.
   - In `.storybook/main.ts`: set `stories` to scan `../src/**/*.stories.@(ts|tsx)`; ensure SCSS/SASS is supported (Storybook supports it by default).

2. **Theme and globals**
   - In `.storybook/preview.tsx`: wrap the UI in `ThemeProvider` from `@boilerplate/ui` and import the package’s global styles (e.g. `_variables.scss`, `_themes.scss`, `_layout.scss`) so stories match the apps.

3. **Add initial stories**
   - Start with a few primitives: `Button.stories.tsx`, `Input.stories.tsx`, `Card.stories.tsx` (show variants, disabled, etc.).
   - Add one auth form story (e.g. `LoginForm.stories.tsx`) to validate theme and any app-like context.

4. **Scripts**
   - In `packages/ui/package.json`: `"storybook": "storybook dev -p 6006"`, `"build-storybook": "storybook build"`.
   - Optionally in root `package.json`: `"storybook": "npm run storybook -w @boilerplate/ui"`.

5. **Documentation**
   - Add a directory-specific doc for `packages/ui` per [documentation-conventions](.cursor/skills/documentation-conventions/SKILL.md): **`packages/ui/PACKAGES-UI.md`** (no extra `README.md` in that directory).
   - Content: how to run Storybook (from root and from `packages/ui`), where stories live (`src/**/*.stories.@(ts|tsx)`), how to add a new story (co-locate with component, use CSF), and pointer to the component-docs skill for agents.

6. **Skill**
   - Add **`.cursor/skills/storybook-component-docs/SKILL.md`** (or similar name) so agents know to add or update Storybook stories when adding or changing UI components in `packages/ui`. Include: when to use (new component, changing props/variants), how to run Storybook (`./scripts/nix/with-env npm run storybook -w @boilerplate/ui`), and reference to `packages/ui/PACKAGES-UI.md`.

## Key files

- [packages/ui/package.json](packages/ui/package.json) – add Storybook deps and scripts.
- `packages/ui/.storybook/main.ts` – story globs, framework, static dir if needed.
- `packages/ui/.storybook/preview.tsx` – ThemeProvider, global SCSS.
- `packages/ui/src/**/*.stories.tsx` – new story files.
- `packages/ui/PACKAGES-UI.md` – directory doc: running Storybook, adding stories, conventions.
- `.cursor/skills/storybook-component-docs/SKILL.md` – agent skill: when and how to add/update stories.

## Verification

- From repo root: `./scripts/nix/with-env npm run storybook -w @boilerplate/ui` (or `cd packages/ui && npm run storybook`) starts the dev server.
- Open a few stories (Button, Input, Card, LoginForm); confirm theme and variants render correctly.
- `npm run build-storybook -w @boilerplate/ui` produces a static build without errors.
- `packages/ui/PACKAGES-UI.md` exists and describes how to run Storybook and add stories.
- `.cursor/skills/storybook-component-docs/SKILL.md` exists and is discoverable for component/story work.

## Out of scope (for this plan)

- Vitest, React Testing Library, or any unit/integration tests.
- Play functions, interaction tests, or Chromatic/visual regression.
- CI runs for Storybook (can be added later).
