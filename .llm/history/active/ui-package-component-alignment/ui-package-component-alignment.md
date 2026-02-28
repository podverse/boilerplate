# UI package component alignment

**Started:** 2026-02-26  
**Context:** Implement plan "Assess WIP and align components in shared UI package" so web and management-web differ at page/layout level only.

### Session 1 - 2026-02-26

#### Prompt (Developer)

Assess WIP and align components in shared UI package

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- AppHeader: Added to UI package with props (title, homeHref, user, onLogout, navItems, optional loginHref, LinkComponent). Web and management-web keep thin connector components that wire useAuth/useRouter and pass props to UI AppHeader.
- ThemeWrapper: Exported from UI (thin wrapper around ThemeProvider). Both apps import from @boilerplate/ui; deleted local ThemeWrapper in both apps.
- management-web: Globals updated to match web (html/body height 100%, overflow hidden, body > \*, .app-view). Root layout wraps children in div.app-view only; AppHeader and main moved to (main) layout.
- management-web: Added (auth) and (main) route groups; (auth) layout uses CenterInViewport with title "Management"; (main) layout uses AppHeader + main. Moved login under (auth), all other pages under (main). Fixed import paths: (main)/page.tsx uses ../../context; (main)/dashboard etc use ../../../context and ../../../lib.
- management-web login: Uses UI LoginForm with wired useAuth, validation, Link; deleted apps/management-web/src/components/LoginForm.tsx. Normalized AuthUser to AppHeaderUser (displayName ?? null) in management-web AppHeader connector.

#### Files Created/Modified

- packages/ui: AppHeader.tsx, AppHeader.module.scss; ThemeContext.tsx (ThemeWrapper); index.ts (exports AppHeader, ThemeWrapper)
- apps/web: AppHeader.tsx (connector), layout.tsx (ThemeWrapper from UI); deleted ThemeWrapper.tsx
- apps/management-web: AppHeader.tsx (connector); layout.tsx (ThemeWrapper from UI, app-view only; removed AppHeader import); styles/globals.scss (viewport/scroll); (auth)/layout.tsx, (auth)/login/page.tsx; (main)/layout.tsx, (main)/page.tsx, dashboard, settings, events, admins pages; deleted ThemeWrapper.tsx, LoginForm.tsx; deleted app/login, app/page, app/dashboard, app/settings, app/events, app/admins

### Session 2 - 2026-02-26

#### Prompt (Developer)

You should avoid using inline style rules as much as possible in the boilerplate. Figure out reusable components whenever you find yourself attempting to do inline styles

#### Key Decisions

- Added reusable layout/typography in UI: Row (horizontal flex, optional wrap), Text (variant muted/error, size sm, as p|span), List (ul with list-plain, optional size sm). Layout utilities in \_layout.scss: .row, .row-wrap, .text-muted, .text-error, .text-sm, .list-plain, .list-plain-sm.
- Themes: --color-error added to light/dark in \_themes.scss for error text.
- AppHeader: Inline styles moved to AppHeader.module.scss (.titleLink, .title).
- Card: First/last paragraph margin reset in Card.module.scss so settings/dashboard don't need inline margin.
- Pages use Row, Text, List and className="text-sm" for links; no remaining inline style in tsx.

#### Files Created/Modified

- packages/ui: Row.tsx, Text.tsx, List.tsx; styles/\_themes.scss (--color-error), \_layout.scss (row, row-wrap, text-muted, text-error, text-sm, list-plain); AppHeader.module.scss, AppHeader.tsx; Card.module.scss; index.ts (exports Row, Text, List)
- apps/management-web: (main)/dashboard, admins, events, settings pages
- apps/web: (main)/dashboard, settings pages
