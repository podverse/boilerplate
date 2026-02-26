# Plan 14: Joi validation

## Scope

Add Joi (or equivalent) for API request body validation. Use for signup, login, post-message,
admin create user (POST /admin/users), and change-password (POST /auth/change-password) payloads.
Apply in routes or middleware; optional shared schemas in helpers package. (The Management
API, plan 32, has its own validation for its endpoints; this plan focuses on the main API.)

## Steps

1. **Dependency**
   - Add `joi` (or `@hapi/joi` if preferred) to `apps/api` package.json. Add types if
     needed (`@types/joi` or use Joi’s built-in types).

2. **Schemas**
   - Define schemas for: signup (email, password, optional displayName), login (email,
     password), post message (body text, optional recipient or scope), admin create user
     (email, password for POST /admin/users), change-password (currentPassword, newPassword).
     Use Joi.object(), .string(), .email(), .min(), .max() as appropriate.
   - Place in `apps/api/src` (e.g. `schemas/auth.ts`, `schemas/message.ts`) or in
     `packages/helpers` if shared with web (e.g. client-side validation). For boilerplate,
     api-only is fine.

3. **Middleware or route-level validation**
   - Option A: Middleware that takes a schema, reads req.body, runs schema.validate(), and
     returns 400 with validation errors on failure; on success attaches validated value to
     req and calls next().
   - Option B: In each route, call schema.validate(req.body) and handle errors. Prefer one
     pattern consistently.

4. **Error response**
   - On validation failure, respond with 400 and a clear payload (e.g. { message: "Validation
     failed", details: error.details }). Do not leak internal schema details in production if
     sensitive.

5. **Apply to routes**
   - Signup route: validate signup schema before creating user.
   - Login route: validate login schema before checking credentials.
   - POST /admin/users: validate admin-create-user schema (email, password).
   - POST /auth/change-password: validate change-password schema (currentPassword, newPassword).
   - Post message route: validate message schema before storing in Valkey (plan 22).
   - Apply message schema in plan 22 when POST /api/messages is added; in this plan wire
     validation for all auth routes (signup, login, admin create user, change-password) and message.

## Key files

- `apps/api/package.json` (joi dependency)
- `apps/api/src/schemas/auth.ts` (or similar)
- `apps/api/src/schemas/message.ts` (or similar)
- `apps/api/src` routes or middleware that use the schemas

## Verification

- Sending invalid body (e.g. missing email, invalid email format) to signup/login/admin-users/change-password/message
  endpoints returns 400 with validation message.
- Valid bodies pass through to business logic (or next middleware).
