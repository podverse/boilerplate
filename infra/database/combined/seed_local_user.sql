-- Seed a predefined dev user for LOCAL only. Mounted in infra/docker/local/docker-compose.yml.
-- Email: localdev@example.com  Password: Test!1Aa
-- email_verified_at set to NOW() so the user can log in immediately without verifying email.
-- Hash generated with bcrypt 10 rounds; safe to commit.

WITH u AS (
  INSERT INTO "user" (profile_visibility, email_verified_at)
  VALUES (false, NOW())
  RETURNING id
)
INSERT INTO user_credentials (user_id, email, password_hash)
SELECT id, 'localdev@example.com', '$2b$10$rPcezdnOXY9EIR8PRsK6tO4Aw/0TE32ADDwwPcmyGzz7xI5Myah5K'
FROM u;

WITH u AS (SELECT user_id AS id FROM user_credentials WHERE email = 'localdev@example.com')
INSERT INTO user_bio (user_id, display_name)
SELECT id, NULL FROM u;
