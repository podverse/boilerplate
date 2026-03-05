-- 0004 migration: drop profile_visibility from user (unused column)

ALTER TABLE "user" DROP COLUMN IF EXISTS profile_visibility;
