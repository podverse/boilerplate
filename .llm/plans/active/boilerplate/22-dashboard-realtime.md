# Plan 22: Dashboard and real-time messages

## Scope

Dashboard page: form to post a message, list of messages (real-time via polling or
WebSocket). Messages stored in Valkey (plan 04). User sees only their own messages unless
they toggle "viewable by anyone" (privacy control). Depends on auth (plan 15), API routes
for messages, Valkey client in api, and optional user profile visibility (plan 12/15).

**Auth UI in scope:** Implement /login and /signup pages (forms that call POST /auth/login
and POST /auth/signup); redirect unauthenticated users from dashboard (and other protected
routes) to /login. Use basic components (plan 19) and i18n keys (plan 21). Plan 15 defines
the API only; this plan owns the minimal login and signup pages in the web app.

## Steps

1. **API: store and read messages**
   - Post message: authenticated route (e.g. POST /api/messages). Body: text (and
     optional recipient id for DMs; for boilerplate, "message to self" or "broadcast" is
     enough). Store in Valkey (e.g. list or stream per user, or key pattern
     `messages:{userId}`). Associate with userId from auth.
   - Get messages: GET /api/messages (authenticated). If user’s "viewable by anyone" is off:
     return only messages where userId matches current user. If on: return also messages
     from other users who have "viewable by anyone" on (or all public messages). Decide
     simple rule (e.g. "my messages" vs "all public") and document.

2. **Privacy flag**
   - User entity or profile: add field `profileVisibility` or `messagesPublic` (boolean).
   - Settings page (plan 20) or dashboard: toggle to allow "viewable by anyone". API uses
     this when returning GET /api/messages and when deciding which messages to show to
     other users.

3. **Real-time**
   - Option A: Polling. Frontend polls GET /api/messages every N seconds; update state and
     re-render list.
   - Option B: WebSocket. Api exposes WS; on new message, push to connected clients (or
     only to the recipient). Frontend subscribes and updates list.
   - Implement one; document. Polling is simpler for boilerplate.

4. **Login and signup pages**
   - Implement `apps/web/src/app/login/page.tsx` and `apps/web/src/app/signup/page.tsx`
     (or equivalent routes). Forms call POST /auth/login and POST /auth/signup; on success
     redirect to dashboard (or store token and redirect). Use components from plan 19 and
     t() from plan 21.

5. **Dashboard page**
   - Route: e.g. `apps/web/src/app/dashboard/page.tsx` (or app/dashboard). Protected:
     redirect to /login if not authenticated.
   - Form: input for message text, submit button. On submit: POST /api/messages; on
     success refresh list or append optimistically.
   - List: display messages (author, text, time). Show "no messages" when empty. If
     real-time is polling, run effect with interval; if WebSocket, update on message
     event.
   - Privacy toggle: switch "viewable by anyone"; call API to update user preference
     (PATCH /api/me or similar) and optionally refetch messages to show others’ public
     messages.

6. **Valkey client in API**
   - Use Redis/Valkey client (e.g. ioredis or node-redis) in apps/api; connect using env
     from plan 04. Implement: set/list or stream for messages; key design (e.g.
     messages:{userId}:list). TTL or max length if needed to avoid unbounded growth.

## Key files

- `apps/api` Valkey client and message store/read helpers
- `apps/api` routes: POST /api/messages, GET /api/messages, optional PATCH /api/me
- `apps/web/src/app/login/page.tsx`, `apps/web/src/app/signup/page.tsx`
- `apps/web/src/app/dashboard/page.tsx`
- User entity or profile with profileVisibility / messagesPublic
- Optional: WebSocket server and client

## Verification

- Logged-in user can post a message; it appears in the list (and is stored in Valkey).
- With "viewable by anyone" off, user sees only their messages; with on, they see their own
  and others’ public messages (per rule). Toggle persists and affects GET /api/messages.
- Real-time: list updates (polling or WebSocket) when new messages arrive.
