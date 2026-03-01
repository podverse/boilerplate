-- 0005: Enforce that every management_user has exactly one credentials and one bio row
-- (created in the same transaction), and that cred/bio rows cannot be deleted directly.

-- Prevent direct DELETE on management_user_credentials; must delete management_user (CASCADE).
CREATE OR REPLACE FUNCTION reject_direct_delete_management_user_credentials()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Cannot delete management_user_credentials directly; delete management_user to remove the user (CASCADE will remove credentials and bio).'
    USING ERRCODE = 'restrict_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_direct_delete_management_user_credentials
  BEFORE DELETE ON management_user_credentials
  FOR EACH ROW EXECUTE PROCEDURE reject_direct_delete_management_user_credentials();

-- Prevent direct DELETE on management_user_bio; must delete management_user (CASCADE).
CREATE OR REPLACE FUNCTION reject_direct_delete_management_user_bio()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Cannot delete management_user_bio directly; delete management_user to remove the user (CASCADE will remove credentials and bio).'
    USING ERRCODE = 'restrict_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_direct_delete_management_user_bio
  BEFORE DELETE ON management_user_bio
  FOR EACH ROW EXECUTE PROCEDURE reject_direct_delete_management_user_bio();

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
