-- 0003: Enforce that every user has exactly one user_credentials row (created in the same
-- transaction). Display name (user_bio) is optional in main. Prevent direct DELETE on user_credentials.

-- Prevent direct DELETE on user_credentials; must delete "user" (CASCADE).
CREATE OR REPLACE FUNCTION reject_direct_delete_user_credentials()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Cannot delete user_credentials directly; delete the user to remove the account (CASCADE will remove credentials and bio).'
    USING ERRCODE = 'restrict_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_direct_delete_user_credentials
  BEFORE DELETE ON user_credentials
  FOR EACH ROW EXECUTE PROCEDURE reject_direct_delete_user_credentials();

-- Every user must have exactly one user_credentials row. Check is deferred to commit so user + credentials
-- (and optionally user_bio) can be inserted in one transaction.
CREATE OR REPLACE FUNCTION check_user_has_credentials()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_credentials c WHERE c.user_id = NEW.id) THEN
    RAISE EXCEPTION 'Every user must have exactly one user_credentials row; create user and credentials in the same transaction.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ensure_user_has_credentials
  AFTER INSERT OR UPDATE ON "user"
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE PROCEDURE check_user_has_credentials();
