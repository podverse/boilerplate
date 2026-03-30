# mailer-smtp-auth

**Started:** 2026-03-24  
**Author:** LLM-assisted  
**Context:** Document MAILER_USER/MAILER_PASSWORD SMTP auth pairing (Brevo), API startup validation, tests.

### Session 1 - 2026-03-24

#### Prompt (Developer)

Mailer credentials and Brevo (SMTP)

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

#### Key Decisions

- **`LOCAL-ENV-OVERRIDES.md`**: Fixed mailer row to canonical **`MAILER_*`** keys; added subsection for SMTP AUTH pairing, Mailpit vs Brevo (**`smtp-relay.brevo.com`**, port 587), and startup validation note.
- **`ENV-REFERENCE.md`**: Extended workload **`mailer`** summary row for optional paired **`MAILER_USER`** / **`MAILER_PASSWORD`**.
- **`validation.ts`**: **`validateMailerSmtpAuthPair()`** when email auth modes; **`validateOptionalUnset`** for **`MAILER_USER`** / **`MAILER_PASSWORD`** in **`admin_only_username`**.
- Tests: email-flow base env constant; both-unset / both-set pass; lone user or password fail; **`user_signup_email`** pairing; username mode rejects stray **`MAILER_USER`**.

#### Files Created/Modified

- `docs/development/LOCAL-ENV-OVERRIDES.md`
- `docs/development/ENV-REFERENCE.md`
- `apps/api/src/lib/startup/validation.ts`
- `apps/api/src/test/startup-validation-auth-mode.test.ts`
- `.llm/history/active/mailer-smtp-auth/mailer-smtp-auth-part-01.md`
