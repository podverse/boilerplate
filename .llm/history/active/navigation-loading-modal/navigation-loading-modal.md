# Navigation loading modal

Started: 2025-02-27  
Context: Show full-window transparent overlay with XL spinner when user clicks in-app links in web and management-web.

## Session 1 - 2025-02-27

### Prompt (Developer)

Whenever a link is pressed in web or management web that will navigate to another page A loading spinner should appear in the center of the page. There should be a component that is a full window size modal that is transparent and the large loading spinner is in the middle of it Also add an extra size. This should be an extra large modal spinner. And it should be the one that is used in the Modal loading spinner along with this, you may need to add a modal component that can be reused in the future for other purposes

### Key Decisions

- Added LoadingSpinner size `xl` (3rem) in packages/ui.
- Created reusable `Modal` component (full viewport overlay, transparent or with optional backdrop, centered content).
- Created `NavigationLoadingOverlay` (Modal + LoadingSpinner size xl, primary variant).
- Added `NavigationProvider` and `NavigationContext` in packages/ui; provider uses `usePathname()` to clear navigating state when route changes, and renders overlay when navigating.
- Link component uses `useNavigationContext()` and calls `setNavigating(true)` on click for internal hrefs (path starting with `/` and not `//`).
- Wrapped both apps (web, management-web) with `NavigationProvider` inside AuthWrapper in root layout.

### Files Created/Modified

- packages/ui: LoadingSpinner (xl size), LoadingSpinner.module.scss, Modal (new), Modal.module.scss, Modal.stories.tsx, NavigationLoadingOverlay.tsx, Modal/index.ts, NavigationContext.tsx, Link.tsx, styles/\_variables.scss ($z-modal), index.ts (exports).
- apps/web/layout.tsx: NavigationProvider wrap.
- apps/management-web/layout.tsx: NavigationProvider wrap.
- packages/ui: LoadingSpinner.stories.tsx (xl in options and Sizes story).

## Session 2 - 2026-03-02

### Prompt (Developer)

When light mode is on the modal is not even readable. I think there is some sort of style missing
because I pressed the delete button. button on the admin management panel and it looks terrible.
Some kind of style is missing

### Key Decisions

- `.contentInner` in `Modal.module.scss` had no background, border-radius, or shadow, making the
  dialog box transparent over the backdrop in all themes.
- Added `background-color: var(--color-bg)`, `border-radius: $radius-md`, and
  `box-shadow: $shadow-modal` to `.contentInner` so the dialog renders as a proper card.

### Files Created/Modified

- packages/ui/src/components/modal/Modal/Modal.module.scss
