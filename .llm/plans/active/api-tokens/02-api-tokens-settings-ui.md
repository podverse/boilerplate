# 02 – API tokens settings UI

## Scope

Build reusable UI components in `packages/ui` for the API token settings section (permission
form, one-time token display with copy button, token list with revoke), and integrate the
settings card into apps/web and optionally apps/management-web settings pages.

**Prerequisites:** Phase 1 (i18n keys for API tokens); Phase 2 (backend routes and contract).

**Key files:**

- `packages/ui/src/components/` – new API token components
- `apps/web/src/app/(main)/settings/page.tsx`
- `apps/management-web/src/app/(main)/settings/page.tsx`

---

## Step 1: ApiTokenPermissionForm (packages/ui)

1. Create a controlled component that:
   - Renders **top-level checkboxes** for Create, Read, Update, Delete (labels from i18n or
     props). Default: **only Read checked**.
   - Renders a list of **resources** (e.g. Me, Auth) with the same CRUD checkboxes, or
     “Apply selected permissions to: [resource checkboxes].” Ensure the user can select
     which endpoints/resources the token can access.
   - Accepts `value` and `onChange` for permissions shape: e.g. `Record<string, number>` (resource
     → CRUD bitmask). Use shared CrudOp/CrudMask from helpers so values align with API.
   - Optionally accepts `resources: { id: string; label: string }[]` from props or from
     shared constants (main API resources). Labels can come from i18n in the app that uses
     the component, or from a context/provider.

2. **Default state:** Read-only selected; permissions object e.g. `{ me: 2, auth: 2 }` (read
   only for each resource) so the API receives a sensible default.

3. Place component under `packages/ui/src/components/ApiTokenPermissionForm/` (or
   `ApiTokens/` namespace). Export from packages/ui.

4. Add Storybook story: show form with default (read only), and with all CRUD + resources
   selected (per storybook-component-docs skill).

---

## Step 2: ApiTokenCreateResult (packages/ui)

1. Create a presentational component that:
   - Displays the **masked token** (e.g. first 8 chars + `…` + last 4, or full token in a
     readonly input; plan says “masked” so prefer truncation or monospace display).
   - **Copy to clipboard** button: on click, copy the full raw token to clipboard (navigator
     clipboard API); show a short success message (e.g. “Copied”) or use existing toast/alert
     pattern from packages/ui.
   - **Message:** e.g. “Copy this token now; it won’t be shown again.” (i18n key from Phase 1.)

2. Props: `token: string` (raw token, shown once), optional `onCopy` callback. Do not
   persist or log the token.

3. Add Storybook story with a dummy token string.

---

## Step 3: ApiTokenList (packages/ui)

1. Create a component that:
   - Accepts `tokens: Array<{ id: string; name: string; expiresAt: string; createdAt: string }>`.
   - Renders a list (or table) with columns: name, expiresAt (formatted), createdAt
     (formatted). Use existing formatting (e.g. formatDateTimeAbbrev or locale date) per
     time-format-local skill if present.
   - **Revoke** button per row; on click, show a **confirmation** (e.g. “Are you sure you
     want to revoke this token?”). Use an **accessible modal/dialog** (e.g. from packages/ui)
     so focus is trapped and Escape cancels; avoid `window.confirm()` for better a11y and
     consistency. On confirm, call `onRevoke(id)`. Optional loading state per row during
     revoke.
   - **Empty state:** when tokens.length === 0, show a short message (e.g. “No API tokens
     yet”; i18n).

2. Do not display raw token anywhere.

3. Add Storybook story with mock tokens and empty state.

---

## Step 4: ApiTokenSettingsCard (packages/ui)

1. Create a composite component that:
   - **Create section:** Form with fields: token name (text input), expiration (date or
     duration picker; user can set any expiration they want), and ApiTokenPermissionForm.
     Submit button (e.g. “Create token”).
   - On submit: call an async prop e.g. `onCreate({ name, expiresAt, permissions })`. Parent
     (app) calls the API and returns the created `{ token, name, expiresAt }`. Card then
     shows **ApiTokenCreateResult** with the token and copy button + message; hide the
     create form until user dismisses or starts creating again.
   - **List section:** Below, render ApiTokenList with `tokens` from prop and `onRevoke(id)`.
     Parent fetches list from API and passes data; onRevoke calls DELETE and then refetches
     list (or parent manages state and refetch).
   - Accept props: `tokens`, `onCreate`, `onRevoke`, `isCreating`, `isRevoking` (optional) for
     loading and error handling. API base URL or fetch function can be passed in so the same
     card works for main API (web) and later management API (management-web).
   - **Error handling:** On create failure (4xx/5xx), show an error message near the form (or
     inline) and do not clear the form. On revoke failure, show a short message (e.g. toast
     or inline) and do not remove the token from the list until the API confirms success.
     Optionally support `error` / `onError` or similar props so the parent can pass API error
     state and message.

2. Use existing Card, Form, Input, Button from packages/ui. Follow reusable-components and
   avoid unknown types (avoid-unknown-types skill).

3. Add Storybook story: mock onCreate/onRevoke, show create flow and list with revoke.

---

## Step 5: apps/web – Settings page integration

1. In `apps/web/src/app/(main)/settings/page.tsx`:
   - Add a **Card** titled “API tokens” (or use translation key from i18n).
   - Inside, render ApiTokenSettingsCard.
   - **Data flow:** Use AuthContext to get the user’s JWT. Implement (or use existing)
     API client that sends `Authorization: Bearer <jwt>`.
   - **onCreate:** POST to main API `/v1/auth/api-tokens` with body { name, expiresAt,
     permissions }. On success, pass `{ token, name, expiresAt }` to the card to show
     ApiTokenCreateResult; refetch list.
   - **List:** GET `/v1/auth/api-tokens`; pass response tokens to ApiTokenList.
   - **onRevoke:** DELETE `/v1/auth/api-tokens/:id`; then refetch list.

2. Ensure settings page remains protected (redirect if not authenticated). Use existing
   routes and API base URL from app config.

---

## Step 6: apps/management-web – Settings page integration

1. In `apps/management-web/src/app/(main)/settings/page.tsx`:
   - Add the **same** ApiTokenSettingsCard (same component from packages/ui).
   - **Option A:** If management users also have main-app accounts and can use main API
     tokens, wire the card to main API with the user’s main-app JWT (if available in
     management-web context).
   - **Option B:** Stub/placeholder: show the card with a message like “API tokens for
     management API coming soon” and disabled create/list until management-api has token
     endpoints.
   - **Option C:** Use a prop or context to pass API base URL and auth token; for
     management-web, point to management-api base when those endpoints exist; for now use
     placeholder or main API if applicable.
   - Goal: **reusable component**; same UI in both apps; only the API base and auth token
     source differ.

---

## Step 7: i18n and accessibility

1. Use i18n keys added in Phase 1 (03): create, name, expiration, permissions
   (create/read/update/delete), resource labels, “Copy token”, “Store this token; it won’t
   be shown again”, revoke, confirm revoke, list empty state. Ensure packages/ui components
   receive translated strings via props or useTranslation (if packages/ui has next-intl
   peer); otherwise apps pass translated strings as props.

2. Buttons and inputs: accessible labels. Confirm revoke dialog: accessible modal with focus
   trapped and Escape to cancel (see Step 3).

---

## Verification

- User can open web settings, see API tokens card, create a token with name and expiration,
  select only Read (default) and chosen resources, submit, see token once with copy button
  and message; token does not appear in list as raw value; list shows name, expiry, created.
- Revoke works with confirmation; after revoke, list updates and that Bearer token returns
  401 on API.
- Management-web and web share the same UI components; management-web shows the card (wired
  or placeholder).
- Storybook stories render for permission form, create result, list, and settings card.
