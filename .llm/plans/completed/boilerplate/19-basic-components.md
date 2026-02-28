# Plan 19: Basic components

## Scope

Add reusable UI building blocks: Button, Input, Card, and layout primitives. Minimal
styling using theme variables (plan 18) and SCSS (plan 16). **Shared UI package:**
Components are implemented in the shared package `packages/ui` (`@boilerplate/ui`) and
exported; both `apps/web` and `apps/management-web` import from the package
(e.g. `import { Button } from '@boilerplate/ui'`). No duplicate component code in either
app. Used by login, signup, dashboard, settings, and management-web.

## Steps

1. **Button**
   - Component: primary and secondary (or default) variant; disabled state; type="submit" |
     "button". Use theme variables for background and text. Optional: loading state.

2. **Input**
   - Text input: label (optional), type (text, email, password), value, onChange, placeholder,
     error message (optional), disabled. Use theme variables; show error state (border or
     text). Support forwardRef if form libs need it.

3. **Card**
   - Wrapper with padding and border/background from theme; optional title and children.
   - Use for login card, message card, settings sections.

4. **Layout primitives**
   - Optional: Stack (vertical/horizontal gap), Inline, or Container (max-width, centered).
   - Keep minimal; can be simple divs with consistent classNames or a small utility component.

5. **Placement and exports**
   - Put components in the **shared package** `packages/ui` (e.g. Button, Input, Card under
     src/components/ or similar). Export from package index (e.g. `export { Button, Input,
     Card, ... }`). Both `apps/web` and `apps/management-web` import from
     `@boilerplate/ui`. Use in login/signup (plan 15/22), dashboard (plan 22), settings
     (plan 20), and management-web (plan 33).

6. **Accessibility**
   - Button: focus visible; Input: associate label with id/aria; Card: semantic if
     needed. No requirement for full a11y audit; basic semantics and focus.

## Key files

- `packages/ui/src/` Button, Input, Card (and optional .module.scss); package.json exports
- Optional: Stack, Container in shared package
- `apps/web` and `apps/management-web` package.json depend on `@boilerplate/ui`

## Verification

- Button and Input render and respond to user input; Card wraps content with correct
  styles. Theme switch (plan 18) updates component colors. Components used on at least one
  page (e.g. login or settings).
