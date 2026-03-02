# JWT Refresh Fix

**Started**: 2026-03-02
**Author**: LLM
**Context**: Management web session cookie was never refreshed after initial login; two bugs in AuthProvider prevented refresh from ever firing.

---

### Session 1 - 2026-03-02

#### Prompt (Developer)

Fix JWT Session Refresh in Management Web

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- Fix hydration gate: change `initialUser === undefined` to `initialUser === undefined || initialUser === null` so that when SSR fails (JWT expired), the client calls hydrate() and attempts to restore the session via the refresh token.
- Add proactive refresh timer: `useEffect` with `setInterval` fires every `SESSION_REFRESH_INTERVAL_MS` (10 minutes) while user is non-null, calling `/auth/refresh` to keep the JWT alive; redirects to login on failure.
- Interval constant defined at module level for easy tuning.

#### Files Created/Modified

- apps/management-web/src/context/AuthContext.tsx
