-- 0005: Enforce that every management_user has exactly one credentials and one bio row
-- (created in the same transaction). Deletion is only via management_user; ON DELETE CASCADE
-- on credentials/bio FKs handles child rows (no triggers that would block CASCADE).

-- Every management_user must have exactly one management_user_credentials and one management_user_bio.
-- Check is deferred to commit so user + cred + bio can be inserted in one transaction.
CREATE OR REPLACE FUNCTION check_management_user_has_cred_and_bio()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM management_user_credentials c WHERE c.management_user_id = NEW.id)
     OR NOT EXISTS (SELECT 1 FROM management_user_bio b WHERE b.management_user_id = NEW.id) THEN
    RAISE EXCEPTION 'Every management_user must have exactly one management_user_credentials and one management_user_bio row; create all three in the same transaction.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ensure_management_user_has_cred_and_bio
  AFTER INSERT OR UPDATE ON management_user
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE PROCEDURE check_management_user_has_cred_and_bio();
