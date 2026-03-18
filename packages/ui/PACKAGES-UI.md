# packages/ui

Shared UI components and styles for the boilerplate apps (web, management-web). Built with React 19, TypeScript, and SCSS modules.

## Storybook (viewing and documentation)

Storybook lets you browse and document components in isolation with theme and variant controls.

### Running Storybook

- **From repo root** (recommended; uses Nix wrapper if present):
  ```bash
  ./scripts/nix/with-env npm run storybook
  ```
  Or without Nix: `npm run storybook`
- **From this package**:
  ```bash
  cd packages/ui && npm run storybook
  ```
  Storybook runs at **http://localhost:6006** by default.

### Building the static Storybook

From repo root:

```bash
./scripts/nix/with-env npm run build-storybook -w @boilerplate/ui
```

Output is in `packages/ui/storybook-static/`.

### Where stories live

Stories are co-located with components under `src/`:

- Glob: `src/**/*.stories.@(ts|tsx)`
- Examples: `Button.stories.tsx`, `Input.stories.tsx`, `Card.stories.tsx`, `auth/LoginForm.stories.tsx`

Primitive and shared components (form, layout, feedback, modal, navigation, table) have stories that document props (via argTypes) and key states (default, loading, disabled, error, etc.). Composed page-level components (e.g. bucket detail, settings layout) may not have dedicated stories.

### Adding a new story

1. Create a file next to the component: `ComponentName.stories.tsx`.
2. Use the Component Story Format (CSF): default export `meta` (e.g. `Meta<typeof Component>`), named exports for each story (e.g. `StoryObj<typeof Component>`).
3. Use `tags: ['autodocs']` in meta if you want docs generated from the component.
4. Use `argTypes` to expose props as controls.

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof MyComponent>;
export const Default: Story = { args: { label: 'Hello' } };
```

### Agent guidance

When adding or changing UI components in this package, add or update Storybook stories so the component catalog stays in sync. See the **storybook-component-docs** skill (`.cursor/skills/storybook-component-docs/SKILL.md`) for when and how to add or update stories.
