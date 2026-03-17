# PII-safe API responses

**Started:** 2026-03-16  
**Context:** Implement plan "Ensure endpoints never return sensitive PII". Credentials were already protected via toJson-only serialization; main gap was main API returning email/username for *other* users in bucket-admin endpoints.

---

### Session 1 - 2026-03-16

#### Prompt (Developer)

Ensure endpoints never return sensitive PII

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

#### Key Decisions

- Added `PublicUserSummary` (id, shortId, displayName) and `userToPublicSummary()` in apps/api/src/lib/userToJson.ts for serializing *other* users without PII.
- Bucket admins controller now uses `userToPublicSummary` instead of `userToJson` so email/username are never returned for other users.
- AGENTS.md clarified: email/username only on auth/self endpoints; use PublicUserSummary for other users. CREDENTIALS-PROTECTION.md noted management-api is admin-only and may return PII for operations/audit.
- New Cursor rule api-no-pii-credentials-in-responses.mdc: never serialize req.user/req.managementUser; use userToJson/managementUserToJson/userToPublicSummary only; never passwordHash/credentials in responses.
- New API integration test pii-credentials-responses.test.ts: asserts login and bucket-admins responses contain no passwordHash/credentials, and bucket-admins user objects have no email/username.

#### Files Created/Modified

- apps/api/src/lib/userToJson.ts (PublicUserSummary, userToPublicSummary)
- apps/api/src/controllers/bucketAdminsController.ts (userToPublicSummary in bucketAdminToJson)
- AGENTS.md (Auth and PII § User in responses)
- apps/management-api/src/CREDENTIALS-PROTECTION.md (admin-only PII note)
- .cursor/rules/api-no-pii-credentials-in-responses.mdc (new)
- apps/api/src/test/pii-credentials-responses.test.ts (new)

### Session 2 - 2026-03-16

#### Prompt (Developer)

Align PII Policy With Intended UX

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

@/Users/mitcheldowney/.cursor/projects/Users-mitcheldowney-repos-pv-pv-code-workspace/terminals/17.txt it seems like the PII feature is implemented incorrectly, because it is a display name and displayName and username should display in web and management web. the only things we never want to display is password (NEVER) and we sometimes want to display "email" when the logged in user requests their OWN user data (we need this email for example for their personal private profile page)

#### Key Decisions

- Updated `PublicUserSummary` to include `username` while keeping `email` excluded for non-self user summaries.
- Kept bucket-admin controller serialization centralized through `userToPublicSummary`; no direct entity serialization was added.
- Updated PII guidance docs/rules to clarify: credentials/password never exposed, email is self-only, username/displayName are allowed for non-self identity in UI lists/details.
- Updated API integration test expectations so non-self summaries must not include email but do include username.
- Aligned management-web bucket-admin request types to include `username` and nullable email.

#### Files Created/Modified

- .llm/history/active/pii-safe-responses/pii-safe-responses.md
- apps/api/src/lib/userToJson.ts
- .cursor/rules/api-no-pii-credentials-in-responses.mdc
- AGENTS.md
- apps/api/src/test/pii-credentials-responses.test.ts
- packages/helpers-requests/src/management-web/bucketAdmins.ts
