# UI Component Group Reorganization

**Started:** 2026-03-01
**Author:** Agent
**Context:** Reorganize the 31 flat component directories in `packages/ui/src/components/` into 6 logical group subdirectories (`form/`, `layout/`, `navigation/`, `table/`, `modal/`, `feedback/`). The public API (`src/index.ts`) export names are unchanged; only internal paths move.

---

### Session 1 - 2026-03-01

#### Prompt (Developer)
UI Component Group Reorganization

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions
- macOS case-insensitive filesystem required temp-rename workaround: moved `Form` → `_Form_tmp`, created `form/` directory, then moved form-group dirs in, finally renamed `_Form_tmp` back to `form/Form`. Same pattern for `Table`/`table` and `Modal`/`modal`.
- All 26 SCSS module files that import from `../../styles/` or `../../../styles/` were updated to correct relative depth for their new location. `form/Form/Form/Form.module.scss` (4 levels deep) needs `../../../../styles/`.
- Cross-group TS/TSX imports updated in 15 component files: ThemeSelector, Link, TableFilterBar, Pagination, GoToPageModal, Form/Form.tsx, AuthForms (4 files), RateLimitModal, NavigationLoadingOverlay, TableWithFilter, FormLinks, Modal.stories.tsx, NavigationContext.tsx.
- `src/index.ts` export paths updated for all 31 components — export names unchanged so all external consumers are unaffected.
- Full monorepo build (`npm run build`) passes after all changes.

#### Files Created/Modified
- `packages/ui/src/components/form/` — form group (AuthForms, Button, CheckboxField, CrudCheckboxes, Form, FormActions, FormSection, Input, PasswordStrengthMeter, Select)
- `packages/ui/src/components/layout/` — layout group (AppView, Card, CenterInViewport, Container, List, PageHeader, Row, Stack, Text)
- `packages/ui/src/components/navigation/` — navigation group (AppHeader, AppTypeTitle, Dropdown, Link, Pagination, Tabs, ThemeSelector)
- `packages/ui/src/components/table/` — table group (Table, TableFilterBar, TableWithFilter)
- `packages/ui/src/components/modal/` — modal group (Modal)
- `packages/ui/src/components/feedback/` — feedback group (LoadingSpinner)
- `packages/ui/src/index.ts` — all 31 component paths updated
- All SCSS module files with `@use '../../styles/'` updated to correct depth
- `packages/ui/src/components/form/Form/Form/Form.tsx` — Card, Stack imports updated
- `packages/ui/src/components/form/Form/FormLinks/FormLinks.tsx` — Link import updated
- `packages/ui/src/components/form/Form/FormLinks/FormLinks.stories.tsx` — Link import updated
- `packages/ui/src/components/form/AuthForms/LoginForm/LoginForm.tsx` — imports updated
- `packages/ui/src/components/form/AuthForms/SignupForm/SignupForm.tsx` — imports updated
- `packages/ui/src/components/form/AuthForms/ForgotPasswordForm/ForgotPasswordForm.tsx` — imports updated
- `packages/ui/src/components/form/AuthForms/ResetPasswordForm/ResetPasswordForm.tsx` — imports updated
- `packages/ui/src/components/navigation/ThemeSelector/ThemeSelector.tsx` — Select, lib, contexts imports updated
- `packages/ui/src/components/navigation/ThemeSelector/ThemeSelector.stories.tsx` — contexts import updated
- `packages/ui/src/components/navigation/Link/Link.tsx` — contexts import updated
- `packages/ui/src/components/navigation/Pagination/Pagination.tsx` — Button import updated
- `packages/ui/src/components/navigation/Pagination/GoToPageModal.tsx` — Button, Input, Modal imports updated
- `packages/ui/src/components/table/TableFilterBar/TableFilterBar.tsx` — Input import updated
- `packages/ui/src/components/table/TableWithFilter/TableWithFilter.tsx` — Pagination import updated
- `packages/ui/src/components/modal/Modal/RateLimitModal.tsx` — Stack, Text imports updated
- `packages/ui/src/components/modal/Modal/NavigationLoadingOverlay.tsx` — LoadingSpinner import updated
- `packages/ui/src/components/modal/Modal/Modal.stories.tsx` — LoadingSpinner import updated
- `packages/ui/src/contexts/NavigationContext.tsx` — NavigationLoadingOverlay import updated

---

### Session 2 - 2026-03-01

#### Prompt (Developer)
if these _layout.scss styles pertain to specific, separate components, then their styles should be moved to their own corresponding scss file

#### Key Decisions
- `.stack` kept in `_layout.scss` — also used as `className="stack"` directly in `AdminForm.tsx` (global utility)
- `.layout-main` kept in `_layout.scss` — used directly in both `apps/web` and `apps/management-web` layout.tsx; container `@extend` inlined into its rules
- All other classes moved to their component's `.module.scss`; components updated to import and use CSS module classes
- `AppHeader.module.scss` `:global(.header-bar)` context selector replaced with direct `.header` class reference

#### Files Created
- `packages/ui/src/components/layout/AppView/AppView.module.scss`
- `packages/ui/src/components/layout/Row/Row.module.scss`
- `packages/ui/src/components/layout/Text/Text.module.scss`
- `packages/ui/src/components/layout/List/List.module.scss`
- `packages/ui/src/components/layout/Container/Container.module.scss`

#### Files Modified
- `packages/ui/src/components/layout/AppView/AppView.tsx`
- `packages/ui/src/components/navigation/AppHeader/AppHeader.tsx`
- `packages/ui/src/components/navigation/AppHeader/AppHeader.module.scss`
- `packages/ui/src/components/layout/Row/Row.tsx`
- `packages/ui/src/components/layout/Text/Text.tsx`
- `packages/ui/src/components/layout/List/List.tsx`
- `packages/ui/src/components/layout/Container/Container.tsx`
- `packages/ui/src/styles/_layout.scss`

---

### Session 3 - 2026-03-01

#### Prompt (Developer)
write a <Main> component and move layout-main into that and i think you can delete _layout.scss

#### Key Decisions
- New `Main` component renders a `<main>` element with the former `.layout-main` styles, following the same pattern as all other layout components
- `_layout.scss` deleted entirely — no more global layout utility classes; all styles now live in component modules
- `@forward 'layout'` removed from `packages/ui/src/styles/index.scss`
- `@use '@boilerplate/ui/styles/layout'` removed from both app `globals.scss` files
- Both app `(main)/layout.tsx` files updated to import and use `<Main>` from `@boilerplate/ui`

#### Files Created
- `packages/ui/src/components/layout/Main/Main.tsx`
- `packages/ui/src/components/layout/Main/Main.module.scss`
- `packages/ui/src/components/layout/Main/index.ts`

#### Files Modified
- `packages/ui/src/index.ts` — exported Main and MainProps
- `apps/web/src/app/(main)/layout.tsx` — replaced `<main className="layout-main">` with `<Main>`
- `apps/management-web/src/app/(main)/layout.tsx` — replaced `<main className="layout-main">` with `<Main>`
- `apps/web/src/styles/globals.scss` — removed `@use layout`
- `apps/management-web/src/styles/globals.scss` — removed `@use layout`
- `packages/ui/src/styles/index.scss` — removed `@forward 'layout'`

#### Files Deleted
- `packages/ui/src/styles/_layout.scss`
