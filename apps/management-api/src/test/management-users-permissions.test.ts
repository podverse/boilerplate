/**
 * Management API – users CRUD permission-based integration tests.
 * Tests that admins with limited permissions are properly gated by requireCrud.
 * Also covers POST /users/:id/change-password permission checks.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSource } from '@boilerplate/orm';
import { managementDataSource } from '@boilerplate/management-orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';
import { createSuperAdminForTest } from './createSuperAdminForTest.js';

const API = config.apiVersionPath;
const superAdminEmail = 'test-super-admin@example.com';
const superAdminPassword = 'test-super-admin-password-1';

describe('management-api users permissions', () => {
  let app: ReturnType<typeof createApp>;
  let superAdminAgent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    await appDataSource.initialize();
    await managementDataSource.initialize();
    await createSuperAdminForTest(superAdminEmail, superAdminPassword);
    app = createApp();
    superAdminAgent = request.agent(app);
    await superAdminAgent
      .post(`${API}/auth/login`)
      .send({ email: superAdminEmail, password: superAdminPassword })
      .expect(200);
  });

  afterAll(async () => {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
    if (managementDataSource.isInitialized) {
      await managementDataSource.destroy();
    }
  });

  describe('admin with read-only permissions on users', () => {
    const ts = Date.now();
    const readOnlyEmail = `users-read-admin-${ts}@example.com`;
    const readOnlyPassword = 'users-read-password-1';
    let readOnlyAdminId: string;
    let readOnlyAgent: ReturnType<typeof request.agent>;
    let targetUserId: string;

    beforeAll(async () => {
      // Create admin with read-only user permissions
      const adminRes = await superAdminAgent
        .post(`${API}/admins`)
        .send({
          email: readOnlyEmail,
          password: readOnlyPassword,
          displayName: `Users Read Admin ${ts}`,
          adminsCrud: 0,
          usersCrud: 2, // read only (CrudMask: create=1, read=2, update=4, delete=8)
          eventVisibility: 'own',
        })
        .expect(201);
      readOnlyAdminId = adminRes.body.admin.id;

      readOnlyAgent = request.agent(app);
      await readOnlyAgent
        .post(`${API}/auth/login`)
        .send({ email: readOnlyEmail, password: readOnlyPassword })
        .expect(200);

      // Create a target user to act on
      const userRes = await superAdminAgent
        .post(`${API}/users`)
        .send({
          email: `target-user-read-${ts}@example.com`,
          password: 'target-user-password-1',
          displayName: `Target User Read ${ts}`,
        })
        .expect(201);
      targetUserId = userRes.body.user.id;
    });

    it('GET /users returns 200 (has read)', async () => {
      const res = await readOnlyAgent.get(`${API}/users`).expect(200);
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('GET /users/:id returns 200 (has read)', async () => {
      const res = await readOnlyAgent.get(`${API}/users/${targetUserId}`).expect(200);
      expect(res.body.user.id).toBe(targetUserId);
    });

    it('POST /users returns 403 (no create permission)', async () => {
      await readOnlyAgent
        .post(`${API}/users`)
        .send({
          email: `denied-create-${ts}@example.com`,
          password: 'password-1',
        })
        .expect(403);
    });

    it('PATCH /users/:id returns 403 (no update permission)', async () => {
      await readOnlyAgent
        .patch(`${API}/users/${targetUserId}`)
        .send({ displayName: 'Unauthorized Update' })
        .expect(403);
    });

    it('DELETE /users/:id returns 403 (no delete permission)', async () => {
      await readOnlyAgent.delete(`${API}/users/${targetUserId}`).expect(403);
    });

    it('POST /users/:id/change-password returns 403 (no canChangePasswords)', async () => {
      await readOnlyAgent
        .post(`${API}/users/${targetUserId}/change-password`)
        .send({ newPassword: 'new-password-1' })
        .expect(403, { message: 'Insufficient permissions to change user password' });
    });

    afterAll(async () => {
      await superAdminAgent.delete(`${API}/users/${targetUserId}`).expect(204);
      await superAdminAgent.delete(`${API}/admins/${readOnlyAdminId}`).expect(204);
    });
  });

  describe('admin with no permissions on users', () => {
    const ts2 = Date.now() + 1;
    const noPermEmail = `users-no-perm-${ts2}@example.com`;
    const noPermPassword = 'users-no-perm-password-1';
    let noPermAdminId: string;
    let noPermAgent: ReturnType<typeof request.agent>;

    beforeAll(async () => {
      const res = await superAdminAgent
        .post(`${API}/admins`)
        .send({
          email: noPermEmail,
          password: noPermPassword,
          displayName: `Users No Perm Admin ${ts2}`,
          adminsCrud: 0,
          usersCrud: 0,
          eventVisibility: 'own',
        })
        .expect(201);
      noPermAdminId = res.body.admin.id;

      noPermAgent = request.agent(app);
      await noPermAgent
        .post(`${API}/auth/login`)
        .send({ email: noPermEmail, password: noPermPassword })
        .expect(200);
    });

    it('GET /users returns 403 (no read permission)', async () => {
      await noPermAgent.get(`${API}/users`).expect(403);
    });

    it('GET /users/:id returns 403 (no read permission)', async () => {
      await noPermAgent
        .get(`${API}/users/00000000-0000-0000-0000-000000000000`)
        .expect(403);
    });

    afterAll(async () => {
      await superAdminAgent.delete(`${API}/admins/${noPermAdminId}`).expect(204);
    });
  });

  describe('admin with canChangePasswords permission', () => {
    const ts3 = Date.now() + 2;
    const changePassEmail = `users-changepw-admin-${ts3}@example.com`;
    const changePassPassword = 'changepw-admin-password-1';
    let changePassAdminId: string;
    let changePassAgent: ReturnType<typeof request.agent>;
    let targetUserId: string;

    beforeAll(async () => {
      const adminRes = await superAdminAgent
        .post(`${API}/admins`)
        .send({
          email: changePassEmail,
          password: changePassPassword,
          displayName: `Change PW Admin ${ts3}`,
          adminsCrud: 0,
          usersCrud: 2, // read (so they can look up user; CrudMask read=2)
          canChangePasswords: true,
          eventVisibility: 'own',
        })
        .expect(201);
      changePassAdminId = adminRes.body.admin.id;

      changePassAgent = request.agent(app);
      await changePassAgent
        .post(`${API}/auth/login`)
        .send({ email: changePassEmail, password: changePassPassword })
        .expect(200);

      const userRes = await superAdminAgent
        .post(`${API}/users`)
        .send({
          email: `target-user-changepw-${ts3}@example.com`,
          password: 'target-user-password-1',
        })
        .expect(201);
      targetUserId = userRes.body.user.id;
    });

    it('POST /users/:id/change-password returns 204 (has canChangePasswords)', async () => {
      await changePassAgent
        .post(`${API}/users/${targetUserId}/change-password`)
        .send({ newPassword: 'new-valid-password-1' })
        .expect(204);
    });

    it('POST /users/:id/change-password returns 400 when newPassword fails validation', async () => {
      const res = await changePassAgent
        .post(`${API}/users/${targetUserId}/change-password`)
        .send({ newPassword: 'x' })
        .expect(400);
      expect(res.body.message).toBeDefined();
    });

    afterAll(async () => {
      await superAdminAgent.delete(`${API}/users/${targetUserId}`).expect(204);
      await superAdminAgent.delete(`${API}/admins/${changePassAdminId}`).expect(204);
    });
  });

});
