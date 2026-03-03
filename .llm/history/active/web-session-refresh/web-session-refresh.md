# Web session and refresh token alignment

**Started:** 2025-03-02  
**Context:** Align apps/web session and refresh token handling with apps/management-web so refresh works on load and proactively.

---

### Session 1 - 2025-03-02

#### Prompt (Developer)
compare the session and refresh token handling between management-web and web. are they aligned? i am unsure that the refresh token handling is working in web, although i think it is working in management-web

#### Key Decisions
- Web previously ran hydrate only when `initialUser === undefined`, so when SSR passed `initialUser === null` (no user at SSR) the client never tried refresh. Aligned with management-web: run hydrate when `initialUser === undefined || initialUser === null`.
- Web had no proactive refresh; management-web refreshes every 10 minutes while logged in. Added the same proactive refresh interval (10 min) in web: when `user !== null`, setInterval calls `webAuth.refresh()`, updates user on success, and on failure clears user, calls logout, redirects to ROUTES.LOGIN. Interval constant and comment note it must be less than API access token expiry (JWT_ACCESS_EXPIRY_SECONDS).

#### Files Created/Modified
- apps/web/src/context/AuthContext.tsx: hydrate when initialUser is undefined or null; added SESSION_REFRESH_INTERVAL_MS and useEffect for proactive refresh.
- .llm/history/active/web-session-refresh/web-session-refresh.md (this file).

---

### Session 2 - 2025-03-02

#### Prompt (Developer)
Reusable session and refresh handling — Implement the plan as specified. Extract shared session-hydration and proactive-refresh logic into @boilerplate/helpers-requests so web and management-web stay aligned; keep tokens and AuthUser types separate per app.

#### Key Decisions
- Added framework-agnostic helpers in helpers-requests (no React): SessionAuthApi type, SESSION_REFRESH_INTERVAL_MS, hydrateSession<T>(), createSessionRefreshLoop<T>(). Apps pass auth client (webAuth / managementWebAuth), baseUrl/getBaseUrl, and parseUser functions.
- hydrateSession returns { user, attemptedRefresh }; caller sets user and redirects to login when user === null && attemptedRefresh && !isPublicPath. createSessionRefreshLoop returns a stop function for useEffect cleanup; onFailure callback does setUser(null), logout, redirect.
- Web and management-web AuthContexts refactored to use these helpers; each app keeps its own AuthUser type and parsers.

#### Files Created/Modified
- packages/helpers-requests/src/session-lifecycle.ts (new): SessionAuthApi, SESSION_REFRESH_INTERVAL_MS, hydrateSession, createSessionRefreshLoop.
- packages/helpers-requests/src/index.ts: exports for session-lifecycle.
- apps/web/src/context/AuthContext.tsx: use hydrateSession and createSessionRefreshLoop from helpers-requests.
- apps/management-web/src/context/AuthContext.tsx: use hydrateSession and createSessionRefreshLoop from helpers-requests.
- .llm/history/active/web-session-refresh/web-session-refresh.md (this file).
