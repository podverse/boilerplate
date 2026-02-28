# auth-messages-shared-constants

Started: 2025-02-27  
Context: Align API and web app auth result messages via shared constants in @boilerplate/helpers.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

Result messages like this that must align with messages sent from the API should Be defined with reusable helpers package constants and should be used both by the APIs and the web apps to ensure perfect alignment

#### Key Decisions

- Added `packages/helpers/src/auth-messages.ts` with `AUTH_MESSAGE_LOGIN_FAILED` and `AUTH_MESSAGE_INVALID_CREDENTIALS`; exported from helpers index.
- APIs (apps/api, apps/management-api) use `AUTH_MESSAGE_INVALID_CREDENTIALS` in auth controllers for 401 login responses.
- Web apps (apps/web, apps/management-web) use `AUTH_MESSAGE_LOGIN_FAILED` in AuthContext fallback and in login pages when comparing `result.message` to show translated `errors.loginFailed`.
- API integration tests (auth.test.ts, management-api.test.ts) assert using `AUTH_MESSAGE_INVALID_CREDENTIALS` so assertions stay aligned with API.

#### Files Created/Modified

- packages/helpers/src/auth-messages.ts (created earlier in conversation)
- packages/helpers/src/index.ts (exports added earlier)
- apps/api/src/controllers/authController.ts
- apps/management-api/src/controllers/authController.ts
- apps/api/src/test/auth.test.ts
- apps/management-api/src/test/management-api.test.ts
- apps/web/src/context/AuthContext.tsx
- apps/management-web/src/context/AuthContext.tsx
- apps/web/src/app/(auth)/login/page.tsx
- apps/management-web/src/app/(auth)/login/page.tsx
- .llm/history/active/auth-messages-shared-constants/auth-messages-shared-constants-part-01.md (this file)
