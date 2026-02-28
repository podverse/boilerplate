# Plan 19: Basic Components, Auth Flow, Settings, Management Web

**Started:** 2026-02-26  
**Context:** Implement Plan 19 (basic components) and settings page with full auth flow; MetaBoost web app and new management-web app.

### Session 1 - 2026-02-26

#### Prompt (Developer)

Plan 19: Basic Components, Auth Flow, Settings, and Management Web. Implement the plan as specified. Do NOT edit the plan file itself. To-do's from the plan have already been created. Mark them as in_progress as you work, complete all the to-dos.

#### Key Decisions

- Shared UI: Added Button, Input, Card, Dropdown to `packages/ui` with theme variables and optional .module.scss; exported from index (extensionless imports for Next.js).
- Font Awesome: Added `@fortawesome/fontawesome-free` to apps/web and apps/management-web; imported CSS in layout.
- Web app: AuthContext (token + user, localStorage, login/logout/setSession, hydrate via GET /auth/me); api-client (getApiBaseUrl from runtime config, fetchApi with token and error shape); AuthWrapper and AppHeader with MetaBoost + lightning icon and user dropdown (Dashboard, Settings, Logout).
- Web pages: Home (centered login when unauthenticated, redirect to /dashboard when authenticated); /login, /signup, /forgot-password, /reset-password with forms and validation; /dashboard and /settings protected (redirect to /login); reset-password page wrapped in Suspense for useSearchParams().
- Management-web: New Next.js app at apps/management-web; login only (no signup); dashboard with links to Admins and Events; /admins (list from GET /admins); /events (list from GET /events); /settings (theme); same shared UI and layout/themes; NEXT_PUBLIC_MANAGEMENT_API_URL for API base.
- Root package.json: Added apps/management-web to workspaces and to type-check script.

#### Files Created/Modified

- packages/ui: Button.tsx, Button.module.scss, Input.tsx, Input.module.scss, Card.tsx, Card.module.scss, Dropdown.tsx, Dropdown.module.scss; index.ts exports; ThemeToggle.tsx (extensionless import).
- apps/web: package.json (Font Awesome); layout (AuthWrapper, Font Awesome import, metadata MetaBoost); AppHeader (MetaBoost + fa-bolt, dropdown when auth, Log in link when not); AuthWrapper, AuthContext, api-client, validation; LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm; app/page, login, signup, forgot-password, reset-password (Suspense), dashboard, settings.
- apps/management-web: New app (package.json, tsconfig, next.config, next-env.d.ts); config/env.ts; lib/api-client, validation; context/AuthContext; components ThemeWrapper, AuthWrapper, AppHeader, LoginForm; styles/globals.scss; app/layout, page, login, dashboard, admins, events, settings.
- package.json: workspaces + management-web, type-check + management-web.

#### Verification

- `npm run build` succeeds for all workspaces (web and management-web Next.js builds).
- `npm run lint` passes after Prettier --write on touched files.
