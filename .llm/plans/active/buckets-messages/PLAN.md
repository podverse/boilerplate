# Buckets / Topics / Messages Feature – Multi-File Plan Set

**Saved for reference.** Full plan set lives in this directory; this file is the consolidated overview.

## Naming

**Bucket** = top-level container (e.g. a show). **Topic** = child of a bucket (e.g. an episode or a specific thread). One level of hierarchy only: Bucket → Topic.

Tables/entities: `bucket`, `bucket_admin`, `bucket_message`. Topics are buckets with `parent_bucket_id` set; top-level buckets have `parent_bucket_id = null`.

**Bucket admin** = admin of a bucket (assigned by the bucket owner). **Management admin** = existing concept in management-api/management-web.

---

## Plan files in this directory

| File                              | Purpose                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| 00-SUMMARY.md                     | Scope, naming, dependency map, key decisions                                               |
| 00-EXECUTION-ORDER.md             | Phase order and pointers to numbered plans                                                  |
| 01-data-model-and-migrations.md   | Entities, DB schema, migrations, ORM                                                        |
| 02-permissions-and-policy.md      | Owner vs bucket admin; CRUD bitmasks; public bucket; message isPublic                      |
| 03-api-endpoints.md               | Main API: buckets, topics, messages, public submit/read                                     |
| 04-web-app-buckets-ui.md          | apps/web: list/create/edit buckets and topics; bucket admins; reuse management-web patterns |
| 05-web-app-messages-and-public.md | Message list/detail; public bucket page; public submit form (no login)                      |
| COPY-PASTA.md                     | Optional copy-paste prompts for parallel agents                                             |

---

## Execution order

1. **Phase 1:** 01 – Data model and migrations  
2. **Phase 2:** 02 – Permissions and policy  
3. **Phase 3:** 03 – API endpoints  
4. **Phase 4:** 04 – Web app buckets UI  
5. **Phase 5:** 05 – Web app messages UI and public bucket page + submit form  

Sequential: no Phase N+1 until Phase N is done.

---

## Scope summary

- **Who:** Main app users (owners, bucket admins), anonymous submitters.
- **What:** Buckets (top-level), Topics (child buckets), messages, bucket admins, public bucket page, public submit.
- **Visibility:** `bucket.is_public` → who can open public page; `message.is_public` → who can see message there and in app.
- **Permissions:** Owner has full CRUD; bucket admins have CRUD per `bucket_crud` / `message_crud` bitmasks (create=1, read=2, update=4, delete=8).
