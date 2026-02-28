# Password security and validation

**Started:** 2025-02-27  
**Context:** Enforce password strength and validation in API, management-api, web, and management-web; shared logic in helpers; strength meter and submit gating in set-password forms.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

Add some kind of password security check And validation process. It should be Enforced in the API for API and management API and displayed on web and management web and the logic that powers it should be in a helper's package somewhere We want a minimum of eight characters, but we want to ensure at least some degree of randomness Along with it, use a common sense and accepted standard and also add to the set password components a visualization that displays to people the level of randomness of their password that they're setting and do not Allow them to submit a password f to set it Unless it meets a minimum threshold. Use common sense practices

#### Key Decisions

- **Helpers:** Added `packages/helpers/src/password.ts` with `getPasswordStrength` (0–4 from length + character sets: lower, upper, digit, symbol), `validatePassword` (min 8, max 72, strength ≥ 2), `getPasswordRequirementsText()`. Exported from helpers index.
- **Minimum strength:** Require at least 2 character sets (e.g. letters + numbers, or letters + symbols) plus length ≥ 8 and ≤ 72 (PASSWORD_MAX_LENGTH).
- **API / management-api:** Call `validatePassword` before hashing in signup, resetPassword, changePassword (API) and createUser, changeUserPassword (management-api); return 400 with helper message when invalid.
- **Web / management-web:** `lib/validation.ts` delegates to helpers’ `validatePassword`; apps depend on `@boilerplate/helpers`. Callers that need `getPasswordRequirementsText` import from `@boilerplate/helpers` (no re-export from app validation).
- **UI:** Added `PasswordStrengthMeter` (4-segment bar, requirements hint when below threshold). SignupForm and ResetPasswordForm show the meter and disable submit until `validatePassword(password).valid`. UI package depends on `@boilerplate/helpers`.

#### Files Created/Modified

- `packages/helpers/src/password.ts` (new)
- `packages/helpers/src/index.ts` (exports)
- `apps/api/src/controllers/authController.ts` (validatePassword in signup, changePassword, resetPassword)
- `apps/management-api/src/controllers/usersController.ts` (validatePassword in createUser, changeUserPassword)
- `apps/web/src/lib/validation.ts` (use helpers for validatePassword only)
- `apps/management-web/src/lib/validation.ts` (same)
- `packages/ui/package.json` (dependencies: @boilerplate/helpers)
- `packages/ui/src/components/PasswordStrengthMeter/PasswordStrengthMeter.tsx` (new)
- `packages/ui/src/components/PasswordStrengthMeter/PasswordStrengthMeter.module.scss` (new)
- `packages/ui/src/components/PasswordStrengthMeter/index.ts` (new)
- `packages/ui/src/components/AuthForms/SignupForm/SignupForm.tsx` (meter + disabled submit)
- `packages/ui/src/components/AuthForms/ResetPasswordForm/ResetPasswordForm.tsx` (meter + disabled submit)
- `packages/ui/src/index.ts` (export PasswordStrengthMeter)

---

### Session 2 - 2025-02-27

#### Prompt (Developer)

This looks like an a code smell to me. You shouldn't export get password requirements text a second time when it is unnecessary. Update your skills if you need to so you don't make this decision again

#### Key Decisions

- Removed re-export of `getPasswordRequirementsText` from `apps/web` and `apps/management-web` `lib/validation.ts`. Callers import it from `@boilerplate/helpers` when needed.
- Updated **.cursor/skills/global/SKILL.md**: do not re-export symbols from app code when they are already exported by a shared package; callers use the canonical source.

#### Files Modified

- `apps/web/src/lib/validation.ts`
- `apps/management-web/src/lib/validation.ts`
- `.cursor/skills/global/SKILL.md`
- `.llm/history/active/password-security-validation/password-security-validation.md`
