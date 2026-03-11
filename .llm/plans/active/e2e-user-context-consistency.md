# E2E User Context String Consistency (revised)

## Goal

- All `setE2EUserContext(testInfo, '...')` strings use a single pattern: **role (permissions)**.
- Management-web: use **super-admin** for the super-admin identity (all permissions); use **admin (…)** for all other management users, with **abbreviated permission notation** in parentheses.
- Reporter: every context string normalizes to a known key with a dedicated color.
- Skill: e2e-readability documents the pattern so future specs stay consistent.

---

## Role names (simplified)

- **unauthenticated** — not logged in (only role that stays gray in the report).
- **basic-user** — web app, logged-in non-admin (e2e basic user).
- **bucket-owner** — web, owner of the bucket.
- **bucket-admin** — web, bucket admin, not owner.
- **super-admin** — management-web super-admin; all permissions (distinct from admin).
- **admin (…)** — management-web non–super-admin; permissions described in parens with abbreviated notation (see below). No "limited-admin" or "admin-with-bucket-admins" as the role name; just "admin" + (qualifiers).

**Web app:** The web app has no "admin" role. Use only **unauthenticated**, **basic-user**, **bucket-owner**, and **bucket-admin**.

---

## Abbreviated permission notation

**Format:** Inside parentheses, list resources. For full CRUD use the **resource name only** (e.g. `users`, `admins`). For read-only or other levels use **resource:level** (e.g. `buckets:R`). Comma- or space-separated.

**Levels:**

- **Resource name only** — full CRUD (e.g. `admins`, `users`).
- **R** — read-only (e.g. `buckets:R`).
- Omit a resource if it has no access, or use `resource:-` for "none" when explicit.

**Resources (management-web):** admins, users, buckets, bucket_messages, bucket_admins. Optionally **events:own** vs **events:all_admins** when it matters.

**Examples (aligned with current seed):**

| Seed identity                         | Canonical user context string                              |
|--------------------------------------|------------------------------------------------------------|
| super-admin (e2e-superadmin)          | `super-admin`                                              |
| limited-admin (e2e-limitedadmin)      | `admin (admins users events:own)`                           |
| admin-with-bucket-admins              | `admin (buckets:R bucket_admins events:all_admins)`        |
| admin-without-bucket-admins           | `admin (buckets:R events:all_admins)`                       |

Use full resource names (admins, users, buckets, bucket_admins) for readability; the reporter normalizes to a CSS-safe suffix.

---

## Full mapping (current string → canonical string)

Use this table when replacing strings in specs. Reporter keys are the normalized (CSS-safe) form of the canonical string.

### Web app (apps/web/e2e)

| Current string   | Canonical string |
|------------------|------------------|
| unauthenticated  | unauthenticated  |
| basic-user       | basic-user       |
| bucket-owner     | bucket-owner     |
| bucket-admin     | bucket-admin     |

(Web has no "admin" role; only unauthenticated, basic-user, bucket-owner, bucket-admin.)

### Management-web (apps/management-web/e2e)

| Current string                  | Canonical string                                  |
|---------------------------------|---------------------------------------------------|
| unauthenticated                 | unauthenticated                                   |
| super-admin                     | super-admin                                       |
| super-admin         | super-admin                                       |
| limited-admin (users read)      | admin (admins users events:own)                   |

For any future specs that use admin-with-bucket-admins or admin-without-bucket-admins seeds:

| Identity (seed)                  | Canonical string                                  |
|---------------------------------|---------------------------------------------------|
| admin-with-bucket-admins         | admin (buckets:R bucket_admins events:all_admins)  |
| admin-without-bucket-admins      | admin (buckets:R events:all_admins)                |

---

## Implementation phases

### Phase 1: Reporter keys and CSS

- Use the **Full mapping** section above as the source of truth for canonical strings.
- Add every **normalized** form (after userContextToClassSuffix) to `KNOWN_USER_CONTEXT_KEYS` in [scripts/e2e-html-steps-reporter.ts](scripts/e2e-html-steps-reporter.ts).
- Add `.test-user-context-value-<suffix>` for each new key (only unauthenticated gray; others distinct).

### Phase 2: Replace strings in specs

- Replace each current string with the canonical form from the **Full mapping** section. Examples:
  - `super-admin` → `super-admin`.
  - `limited-admin (users read)` → `admin (admins users events:own)`.
  - For admin-with-bucket-admins: `admin (buckets:R bucket_admins events:all_admins)`.
  - For admin-without-bucket-admins: `admin (buckets:R events:all_admins)`.
- Do not change login helpers or test behavior; only the string passed to `setE2EUserContext`.

### Phase 3: Skill and docs

- **[.cursor/skills/e2e-readability/SKILL.md](.cursor/skills/e2e-readability/SKILL.md)** — In "User context in reports":
  - Pattern: **role** or **role (permissions)**. Web app roles: **unauthenticated**, **basic-user**, **bucket-owner**, **bucket-admin** only (web has no "admin" role).
  - Management-web: use **super-admin** for the super-admin identity. For all other management users use **admin (…)** with abbreviated permission notation: full CRUD = resource name only (e.g. `admins`, `users`); read-only = `resource:R` (e.g. `buckets:R`). Examples: `admin (admins users events:own)`, `admin (buckets:R bucket_admins events:all_admins)`.
  - Do not use "limited-admin", "admin with X", or "admin without X" as the role name.
  - Include 2–3 good examples and 1–2 bad examples.
- **[docs/testing/E2E-SPEC-REPORT-COMMANDS.md](docs/testing/E2E-SPEC-REPORT-COMMANDS.md)** — Align examples with this pattern.

---

## Files to touch

- [scripts/e2e-html-steps-reporter.ts](scripts/e2e-html-steps-reporter.ts) — KNOWN_USER_CONTEXT_KEYS and CSS.
- All specs in apps/web/e2e and apps/management-web/e2e that call setE2EUserContext.
- [.cursor/skills/e2e-readability/SKILL.md](.cursor/skills/e2e-readability/SKILL.md).
- [docs/testing/E2E-SPEC-REPORT-COMMANDS.md](docs/testing/E2E-SPEC-REPORT-COMMANDS.md) (optional).

---

## Execution order

1. Full mapping is documented in this plan (see **Full mapping** section).
2. Update reporter: add all normalized keys and corresponding `.test-user-context-value-<suffix>` CSS (Phase 1).
3. Update e2e-readability skill and docs (Phase 3).
4. Replace strings in specs per Full mapping; run a focused E2E report to confirm.
