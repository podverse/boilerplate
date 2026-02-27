-- 0002 migration: admin_permissions – CRUD bitmasks, can_change_passwords, can_assign_permissions, event_visibility

-- Per-admin permissions (one row per admin; super admin has implicit full access).
-- admins_crud, users_crud: 0–15 bitmask (create=1, read=2, update=4, delete=8).
CREATE TABLE IF NOT EXISTS admin_permissions (
    admin_id UUID PRIMARY KEY REFERENCES management_user(id) ON DELETE CASCADE,
    admins_crud INTEGER NOT NULL DEFAULT 0 CHECK (admins_crud >= 0 AND admins_crud <= 15),
    users_crud INTEGER NOT NULL DEFAULT 0 CHECK (users_crud >= 0 AND users_crud <= 15),
    can_change_passwords BOOLEAN NOT NULL DEFAULT false,
    can_assign_permissions BOOLEAN NOT NULL DEFAULT false,
    event_visibility TEXT NOT NULL DEFAULT 'own' CHECK(event_visibility IN ('own', 'all_admins', 'all'))
);
