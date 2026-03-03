# 05 – Web app: messages and public pages

**Scope:** Messages UI for logged-in users; public bucket page (read-only messages); public submit form (no login).

## Authenticated message list/detail

- Under bucket detail or `/buckets/[id]/messages`.
- Table or list of messages: sender_name, body snippet, is_public, created_at.
- Filter by is_public if desired; edit/delete by permission.
- Reuse table/filter patterns from management-web.

## Public bucket page (anyone)

- Route: e.g. `/b/[slug]` or `/buckets/[slug]` (short path).
- No auth.
- Fetch `GET /v1/buckets/by-slug/:slug` and `GET /v1/buckets/by-slug/:slug/messages`.
- If bucket not public, show 404.
- Display only messages with `is_public === true`.
- No edit/delete; display only.
- Optional: shareable URL in bucket settings (“Public page: https://.../b/your-slug”).

## Public submit form

- Same page or separate route (e.g. `/b/[slug]/submit`).
- Form: sender name, message body, “Show publicly” (isPublic) checkbox.
- POST to public submit endpoint; success/error message.
- No login; rate-limit message in API if needed.
- Link to this submit form from public bucket page.

## Routing and layout

- Public routes must not require auth; add to public paths so 401 doesn’t redirect.
- Keep layout minimal (header/footer as you prefer) for public page and submit form.

## Verification

- Public page shows only public messages.
- Submit adds message and (if isPublic) it appears on public page.
- Owner/admin sees all messages in app.
- 404 for non-public bucket on public URL.
