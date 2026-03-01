# backend-i18n-api-management-api

Started: 2025-02-27  
Context: Add i18n to API and management-api for user-facing messages only; same default/supported locales and originals+overrides+compiled pattern as web apps; shared package for both APIs.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

Add I eighteen handling to The API and management API. The default should be the same as the web and management web app and also the supported locales should be the same There are key differences, however. Where air messages are not intended to be seen by Users surfaced in the Client and not just error messages but messages in general, but identify which Parts of API and management API have messages that are intended to be surfaced to the user like in the case of email text or password validation and use an I-18N implementation. Since these are backend services and don't have next, it will have to be a different system than next INTL. However, whatever you use it should have the same Originals compiled overrides pattern and since the I-18N handling will be consistent between API and management API, it should be Put all the helper files, methods, functions should be within their own package so that it can be reused across both applications.

#### Key Decisions

- Created **packages/helpers-i18n**: backend i18n package with same locales as web (en-US, es), same originals/overrides/compiled pattern, no Next.js; uses JSON bundles and `t(locale, key, params?)` with `{param}` interpolation.
- **User-facing messages only:** Password validation (returned in 400 responses) and email subject/text/html (verification, password reset, email-change). Internal messages (e.g. "Server configuration error", "Authentication required") are not translated.
- **Locale resolution:** From request `Accept-Language` via `resolveLocale()`; env `DEFAULT_LOCALE` and `SUPPORTED_LOCALES` supported (same semantics as web).
- **API:** authController uses `getPasswordValidationMessages(resolveLocale(req.get('Accept-Language')))` for change-password, signup, resetPassword; mailer send.ts accepts locale and uses `getVerificationEmailContent`, `getPasswordResetEmailContent`, `getEmailChangeVerificationContent`. Removed apps/api/src/lib/password-messages.ts.
- **Management-api:** usersController uses `getPasswordValidationMessages(resolveLocale(req.get('Accept-Language')))` for createUser and updateUser (password change). No mailer. Removed apps/management-api/src/lib/password-messages.ts.
- Root **i18n:compile** runs helpers-i18n compile; **i18n:validate** validates web, management-web, and helpers-i18n. Sync points doc updated to include packages/helpers-i18n/src/constants.ts when adding locales.

#### Files Created/Modified

- packages/helpers-i18n/ (new package: package.json, tsconfig.json, .gitignore, scripts/compile.mjs, i18n/originals/en-US.json, es.json, src/constants.ts, load.ts, t.ts, resolve-locale.ts, password-messages.ts, email-messages.ts, index.ts, README.md)
- package.json (workspaces + helpers-i18n, i18n:compile extended)
- scripts/i18n/validate.mjs (validateI18nDir, validateHelpersI18n, run helpers-i18n when no arg)
- apps/api/package.json (dependency @boilerplate/helpers-i18n)
- apps/api/src/controllers/authController.ts (use resolveLocale, getPasswordValidationMessages, pass locale to send\*Email)
- apps/api/src/lib/mailer/send.ts (accept locale, use helpers-i18n email content)
- apps/api/src/lib/password-messages.ts (deleted)
- apps/management-api/package.json (dependency @boilerplate/helpers-i18n)
- apps/management-api/src/controllers/usersController.ts (use resolveLocale, getPasswordValidationMessages)
- apps/management-api/src/lib/password-messages.ts (deleted)
- docs/localization/I18N.md (Backend i18n section, sync points, commands)
- .cursor/skills/i18n/SKILL.md (helpers-i18n in layout, commands, sync points, where things live)
- .llm/history/active/backend-i18n-api-management-api/backend-i18n-api-management-api-part-01.md (this file)
