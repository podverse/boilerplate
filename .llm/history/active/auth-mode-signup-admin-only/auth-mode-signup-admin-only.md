# auth-mode-signup-admin-only

Started: 2025-03-10  
Context: AUTH_MODE user_signup_email / admin_only plan – require explicit AUTH_MODE at startup, fix signup/verification behavior and docs, align integration and E2E specs.

---

### Session 1 - 2025-03-10

#### Prompt (Developer)

AUTH_MODE user_signup_email / admin_only and signup/verification alignment

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **Todo 6 (Integration tests):** Default test env in `setup.ts` sets `AUTH_MODE=admin_only`. Auth test files that need signup/mailer set `AUTH_MODE=user_signup_email` at top level (auth-locale, auth-mailer, auth-username). auth-rate-limit changed from `self_signup` to `user_signup_email`. auth-no-mailer relies on setup default (admin_only); no change.
- **Todo 7 (E2E):** Option A – reframed duplicate-email test title and step/capture text to state that the message depends on AUTH_MODE (admin_only vs user_signup_email); assertion regex unchanged (already accepts both outcomes).

#### Files Created/Modified (this session)

- apps/api/src/test/setup.ts (add AUTH_MODE: 'admin_only')
- apps/api/src/test/auth-rate-limit.test.ts (self_signup → user_signup_email)
- apps/api/src/test/auth-locale.test.ts (add AUTH_MODE=user_signup_email)
- apps/api/src/test/auth-mailer.test.ts (add AUTH_MODE=user_signup_email)
- apps/api/src/test/auth-username.test.ts (add AUTH_MODE=user_signup_email)
- apps/web/e2e/signup-unauthenticated.spec.ts (reframe duplicate-email test per Option A)
- .llm/history/active/auth-mode-signup-admin-only/auth-mode-signup-admin-only.md (this file)

#### Note

Plan items 1–5 were implemented in a prior session (API startup validation, config + .env.example + OpenAPI, app/auth router, API error messages, web app surfacing res.error?.message). This session completed items 6 (integration tests) and 7 (E2E signup spec).
