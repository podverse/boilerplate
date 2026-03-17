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
