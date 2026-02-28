# Reusable auth form and links

**Started:** 2025-02-27  
**Context:** Extract submit-error and links pattern from auth forms in packages/ui.

---

### Session 1 - 2025-02-27

#### Prompt (Developer)

It seems like submit error is a common pattern in the auth forms. Maybe you should create a form component that Handles that in a reusable way. Also links seems to be reusable

#### Key Decisions

- Added **AuthForm**: wraps Card + form + Stack, renders **SubmitError** when `submitError` is set, then children. Handles common "form with submit error at top" pattern.
- Added **SubmitError**: displays `message` in a styled `<p role="alert">` when truthy; uses shared `AuthForm.module.scss` for `.submitError`.
- Added **AuthLinks**: takes `LinkComponent`, `items` (`{ href, children }[]`), optional `separator` (default `' · '`), optional `prefix` (e.g. "Already have an account? " for Signup). Renders a single `<p className={styles.links}>` row.
- Single shared **AuthForm.module.scss** with `.submitError` and `.links`; removed duplicate SCSS from LoginForm, ForgotPasswordForm, ResetPasswordForm, SignupForm (deleted those four module scss files).
- Auth form `onSubmit` types normalized to `React.FormEvent<HTMLFormElement>` (was `React.SubmitEvent` in some props).

#### Files Created/Modified

- `packages/ui/src/auth/AuthForm.module.scss` (new)
- `packages/ui/src/auth/AuthForm.tsx` (new)
- `packages/ui/src/auth/AuthLinks.tsx` (new)
- `packages/ui/src/auth/SubmitError.tsx` (new)
- `packages/ui/src/auth/LoginForm.tsx` (refactored to use AuthForm + AuthLinks)
- `packages/ui/src/auth/ForgotPasswordForm.tsx` (refactored; success block uses AuthLinks)
- `packages/ui/src/auth/ResetPasswordForm.tsx` (refactored)
- `packages/ui/src/auth/SignupForm.tsx` (refactored; AuthLinks with prefix)
- `packages/ui/src/auth/index.ts` (exports for AuthForm, AuthLinks, SubmitError and types)
- `packages/ui/src/index.ts` (exports for new auth components)
- Deleted: `LoginForm.module.scss`, `ForgotPasswordForm.module.scss`, `ResetPasswordForm.module.scss`, `SignupForm.module.scss`

---

### Session 2 - 2025-02-27

#### Prompt (Developer)

You called authform, but can we just call it form instead?

#### Key Decisions

- Renamed **AuthForm** → **Form**, **AuthFormProps** → **FormProps**. Added `Form.tsx` and `Form.module.scss`; SubmitError and AuthLinks now import styles from `Form.module.scss`. Removed `AuthForm.tsx` and `AuthForm.module.scss`.

#### Files Created/Modified

- `packages/ui/src/auth/Form.tsx` (new), `packages/ui/src/auth/Form.module.scss` (new)
- `packages/ui/src/auth/AuthForm.tsx`, `packages/ui/src/auth/AuthForm.module.scss` (deleted)
- `packages/ui/src/auth/SubmitError.tsx`, AuthLinks.tsx (import from Form.module.scss)
- `packages/ui/src/auth/LoginForm.tsx`, ForgotPasswordForm, ResetPasswordForm, SignupForm (use Form)
- `packages/ui/src/auth/index.ts`, `packages/ui/src/index.ts` (export Form / FormProps)
