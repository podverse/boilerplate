/**
 * Management API integration tests: auth, admins CRUD, events.
 * Requires main and management test DBs to exist and be initialized.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSource } from '@boilerplate/orm';
import { managementDataSource } from '@boilerplate/management-orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';
import { bootstrapSuperAdmin } from '../lib/bootstrapSuperAdmin.js';

const API = config.apiVersionPath;
const superAdminEmail = `super-${Date.now()}@example.com`;
const superAdminPassword = 'super-admin-password-1';

describe('management-api', () => {
  let app: ReturnType<typeof createApp>;
  let superAdminToken: string;

  beforeAll(async () => {
    process.env.SUPER_ADMIN_EMAIL = superAdminEmail;
    process.env.SUPER_ADMIN_PASSWORD = superAdminPassword;
    await appDataSource.initialize();
    await managementDataSource.initialize();
    await bootstrapSuperAdmin();
    app = createApp();
    const loginRes = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: superAdminEmail, password: superAdminPassword })
      .expect(200);
    superAdminToken = loginRes.body.token;
  });

  afterAll(async () => {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
    if (managementDataSource.isInitialized) {
      await managementDataSource.destroy();
    }
  });

  describe('versioned root', () => {
    it('GET /health returns 200 with status and app name', async () => {
      const res = await request(app).get(`${API}/health`).expect(200);
      expect(res.body).toEqual({ status: 'ok', app: config.appName });
    });

    it('GET / returns 200 with message and env', async () => {
      const res = await request(app).get(`${API}/`).expect(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain(config.appName);
      expect(res.body).toHaveProperty('env');
      expect(res.body.env).toHaveProperty('port');
    });
  });

  describe('Swagger /api-docs', () => {
    it('GET /api-docs returns 200 (Swagger UI)', async () => {
      const res = await request(app).get('/api-docs/').expect(200);
      expect(res.text).toContain('swagger');
    });
  });

  describe('POST /auth/login', () => {
    it('returns 400 when email or password missing', async () => {
      await request(app).post(`${API}/auth/login`).send({}).expect(400);
      await request(app).post(`${API}/auth/login`).send({ email: 'a@b.com' }).expect(400);
      await request(app).post(`${API}/auth/login`).send({ password: 'x' }).expect(400);
    });

    it('returns 401 for unknown email', async () => {
      await request(app)
        .post(`${API}/auth/login`)
        .send({ email: 'unknown@example.com', password: 'any' })
        .expect(401, { message: 'Invalid credentials' });
    });

    it('returns 401 for wrong password', async () => {
      await request(app)
        .post(`${API}/auth/login`)
        .send({ email: superAdminEmail, password: 'wrong' })
        .expect(401, { message: 'Invalid credentials' });
    });

    it('returns 200 with token and user for valid credentials', async () => {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: superAdminEmail, password: superAdminPassword })
        .expect(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(superAdminEmail);
      expect(res.body.user.isSuperAdmin).toBe(true);
    });
  });

  describe('GET /auth/me', () => {
    it('returns 401 without Authorization', async () => {
      await request(app).get(`${API}/auth/me`).expect(401);
    });

    it('returns 200 with user when authenticated', async () => {
      const res = await request(app)
        .get(`${API}/auth/me`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
      expect(res.body.user.email).toBe(superAdminEmail);
      expect(res.body.user.isSuperAdmin).toBe(true);
    });
  });

  describe('GET /events', () => {
    it('returns 401 without auth', async () => {
      await request(app).get(`${API}/events`).expect(401);
    });

    it('returns 200 with events array when authenticated', async () => {
      const res = await request(app)
        .get(`${API}/events`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
      expect(res.body).toHaveProperty('events');
      expect(Array.isArray(res.body.events)).toBe(true);
    });
  });

  describe('admins CRUD (super admin)', () => {
    let adminId: string;
    const adminEmail = `admin-${Date.now()}@example.com`;
    const adminPassword = 'admin-password-1';

    it('POST /admins creates admin and returns 201', async () => {
      const res = await request(app)
        .post(`${API}/admins`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          email: adminEmail,
          password: adminPassword,
          displayName: 'Test Admin',
          adminsCrud: 0,
          usersCrud: 15,
          eventVisibility: 'own',
        })
        .expect(201);
      expect(res.body.admin).toHaveProperty('id');
      expect(res.body.admin.email).toBe(adminEmail);
      expect(res.body.admin.displayName).toBe('Test Admin');
      expect(res.body.admin.isSuperAdmin).toBe(false);
      adminId = res.body.admin.id;
    });

    it('GET /admins returns list including new admin', async () => {
      const res = await request(app)
        .get(`${API}/admins`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
      expect(res.body.admins).toBeDefined();
      const found = res.body.admins.find((a: { id: string }) => a.id === adminId);
      expect(found).toBeDefined();
      expect(found.email).toBe(adminEmail);
    });

    it('GET /admins/:id returns admin', async () => {
      const res = await request(app)
        .get(`${API}/admins/${adminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
      expect(res.body.admin.id).toBe(adminId);
      expect(res.body.admin.email).toBe(adminEmail);
    });

    it('PATCH /admins/:id updates admin', async () => {
      const res = await request(app)
        .patch(`${API}/admins/${adminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ displayName: 'Updated Admin' })
        .expect(200);
      expect(res.body.admin.displayName).toBe('Updated Admin');
    });

    it('POST /admins/change-password changes own password', async () => {
      const adminLogin = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: adminEmail, password: adminPassword })
        .expect(200);
      const newPassword = 'admin-password-2';
      await request(app)
        .post(`${API}/admins/change-password`)
        .set('Authorization', `Bearer ${adminLogin.body.token}`)
        .send({ currentPassword: adminPassword, newPassword })
        .expect(204);
      await request(app)
        .post(`${API}/auth/login`)
        .send({ email: adminEmail, password: newPassword })
        .expect(200);
    });

    it('DELETE /admins/:id removes admin', async () => {
      await request(app)
        .delete(`${API}/admins/${adminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(204);
      await request(app)
        .get(`${API}/admins/${adminId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(404);
    });
  });

  describe('users CRUD (super admin, main DB)', () => {
    it('GET /users returns 200 with users array', async () => {
      const res = await request(app)
        .get(`${API}/users`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
      expect(res.body).toHaveProperty('users');
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('POST /users creates main-app user and GET /users/:id returns it', async () => {
      const email = `user-${Date.now()}@example.com`;
      const password = 'user-password-1';
      const createRes = await request(app)
        .post(`${API}/users`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          email,
          password,
          displayName: 'Test User',
        })
        .expect(201);
      expect(createRes.body.user).toHaveProperty('id');
      expect(createRes.body.user.email).toBe(email);
      const userId = createRes.body.user.id;

      const getRes = await request(app)
        .get(`${API}/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);
      expect(getRes.body.user.id).toBe(userId);
      expect(getRes.body.user.email).toBe(email);
    });
  });
});
