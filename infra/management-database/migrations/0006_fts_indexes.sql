-- 0006: Full-text search (FTS) GIN indexes for management list search (admins, events).
-- Used by management-api list admins and list events when search query param is present.
-- Config 'simple' for prefix matching (no stemming); queries use to_tsquery('simple', built_prefix_query).

-- Admins: search over email (credentials) and display_name (bio)
CREATE INDEX IF NOT EXISTS idx_management_user_credentials_fts_email
  ON management_user_credentials USING GIN (to_tsvector('simple', email));

CREATE INDEX IF NOT EXISTS idx_management_user_bio_fts_display_name
  ON management_user_bio USING GIN (to_tsvector('simple', display_name));

-- Events: search over action, actor_type, target_type, target_id, details
CREATE INDEX IF NOT EXISTS idx_management_event_fts
  ON management_event USING GIN (
    to_tsvector(
      'simple',
      action || ' ' || coalesce(actor_type, '') || ' ' || coalesce(target_type, '')
        || ' ' || coalesce(target_id, '') || ' ' || coalesce(details, '')
    )
  );
