# Plan 15: Auth handling

## Scope

Implement auth flow: register (signup), login, optional logout. Store users in Postgres via
@boilerplate/orm (plan 12). Use sessions or JWT; protect routes that require auth. No OAuth for
boilerplate unless specified.

## Steps

1. **Signup**
   - POST route (e.g. /auth/signup or /api/auth/register). Validate body (plan 14: email,
     password). Check user does not exist (by email); hash password (bcrypt or similar);
     create User via ORM; return 201 with user id and optionally a session token or
     success message. On duplicate email return 409.

2. **Login**
   - POST route (e.g. /auth/login). Validate body (email, password). Find user by email;
     compare password with hash; if valid, create session or issue JWT. Return 200 with
     token/session id and optional user info. On invalid credentials return 401.

3. **JWT (chosen); design for revocable API keys later**
   - Use **JWT** for browser/auth flows: sign with a secret from env (JWT_SECRET); set
     expiry (e.g. 7d); accept in Authorization header (Bearer) or cookie. Document in API
     README. JWT is preferred over cookie-based session for this boilerplate because the
     repo will also support **revocable API keys** for programmatic access; both JWT and API
     keys can be carried in headers and checked in the same middleware.
   - **Revocable API keys:** Design the auth layer so that later you can add an api_keys
     table (e.g. userId, key hash, name, lastUsed, revoked), middleware that accepts
     either `Authorization: Bearer <jwt>` or `Authorization: ApiKey <key>` (or
     X-API-Key header), and a route to create/revoke keys. Do not implement API keys in
     this plan; only ensure the auth middleware and route structure do not block adding
     them (e.g. a single requireAuth middleware that checks JWT first, then API key).

4. **Protected routes**
   - Middleware that checks session or JWT; if missing/invalid return 401; otherwise attach
     user (or userId) to req and call next(). Apply to routes that require auth (e.g. post
     message, get my messages, settings).

5. **Logout**
   - POST /auth/logout or GET: destroy session or invalidate token (client can discard JWT;
     optional server-side blocklist for JWT). Return 204 or 200.

6. **Password hashing**
   - Use bcrypt (or similar) in api; store only hash in User entity. Do not log or return
     passwords.

## Key files

- `apps/api/src/routes/auth.ts` (or auth controller + routes)
- `apps/api/src` middleware for auth (e.g. requireAuth.ts)
- `apps/api` dependency on @boilerplate/orm, bcrypt, and session or jsonwebtoken
- Env: SESSION_SECRET or JWT_SECRET, and any store config

## Verification

- Signup with valid email/password creates user and returns success; duplicate email
  returns 409.
- Login with valid credentials returns token/session; invalid returns 401.
- Request to protected route without auth returns 401; with valid token/session returns
  success.
- Logout invalidates session or client discards token; next request to protected route
  returns 401.
