---
name: button-loading-async
description: Always show a loading spinner in a button when it triggers an async action (submit, save, delete, etc.).
version: 1.0.0
---

# Button loading state for async actions

**When to use:** Whenever you add or change a button that triggers an async request (form submit, save, delete, invite, etc.).

## Rule

Any button that starts an async operation (API call, mutation) must:

1. **Track in-flight state** – e.g. `const [loading, setLoading] = useState(false);` and set `true` at the start of the request, `false` in `finally` (or on success/error).
2. **Pass it to the Button** – use the `loading` prop on `Button` from `@boilerplate/ui`: `<Button ... loading={loading}>`. The Button shows an inline spinner and stays disabled while `loading` is true.

## Why

- Users get immediate feedback that the action is in progress.
- Prevents double-submit and accidental repeated clicks.
- Matches expected UX for forms and destructive actions.

## Checklist

- Does this button trigger a fetch, mutation, or other async work? → Add (or reuse) a loading state and pass `loading={...}` to the Button.
- For form submit buttons, the same state used for `disabled={loading}` should be passed as `loading={loading}` so the spinner appears.
