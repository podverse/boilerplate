# Plan 19: Basic components

## Scope

Add reusable UI building blocks: Button, Input, Card, and layout primitives. Minimal styling
using theme variables (plan 18) and SCSS (plan 16). Used by login, signup, dashboard, and
settings.

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
   - Put components in `apps/web/src/components/` (e.g. Button, Input, Card under
     components/ui/ or similar). Export from index or import directly. Use in login/signup
     form (plan 15 frontend), dashboard (plan 22), and settings (plan 20).

6. **Accessibility**
   - Button: focus visible; Input: associate label with id/aria; Card: semantic if
     needed. No requirement for full a11y audit; basic semantics and focus.

## Key files

- `apps/web/src/components/Button.tsx` (and optional .module.scss)
- `apps/web/src/components/Input.tsx`
- `apps/web/src/components/Card.tsx`
- Optional: Stack, Container, etc.
- Use of theme variables in component styles

## Verification

- Button and Input render and respond to user input; Card wraps content with correct
  styles. Theme switch (plan 18) updates component colors. Components used on at least one
  page (e.g. login or settings).
