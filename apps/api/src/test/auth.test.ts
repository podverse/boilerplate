/**
 * API integration tests: auth endpoints unaffected by mailer mode.
 * Covers versioned root, login, logout, me, change-password.
 * For mode-specific flows see auth-no-mailer.test.ts and auth-mailer.test.ts.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { UserService, appDataSource } from '@boilerplate/orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';
import { hashPassword } from '../lib/auth/hash.js';

const API = config.apiVersionPath;

describe('auth (shared)', () => {
  let app: ReturnType<typeof createApp>;
  let testUserToken: string;
  const testUserEmail = `test-${Date.now()}@example.com`;
  const testUserPassword = 'test-password-1';

  beforeAll(async () => {
    await appDataSource.initialize();
    app = createApp();
    const hashed = await hashPassword(testUserPassword);
    await UserService.create({
      email: testUserEmail,
      password: hashed,
      displayName: 'Test User',
    });
  });

  afterAll(async () => {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
  });

  describe('versioned root routes', () => {
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
        .send({ email: testUserEmail, password: 'wrong-password' })
        .expect(401, { message: 'Invalid credentials' });
    });

    it('returns 200 with token and user for valid credentials', async () => {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: testUserEmail, password: testUserPassword })
        .expect(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUserEmail);
      expect(res.body.user.displayName).toBe('Test User');
      testUserToken = res.body.token;
    });
  });

  describe('POST /auth/logout', () => {
    it('returns 204', async () => {
      await request(app).post(`${API}/auth/logout`).expect(204);
    });
  });

  describe('GET /auth/me', () => {
    it('returns 401 without Authorization', async () => {
      await request(app).get(`${API}/auth/me`).expect(401);
    });

    it('returns 401 with invalid token', async () => {
      await request(app)
        .get(`${API}/auth/me`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('returns 200 with user when authenticated', async () => {
      const res = await request(app)
        .get(`${API}/auth/me`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .expect(200);
      expect(res.body.user.email).toBe(testUserEmail);
    });
  });

  describe('POST /auth/change-password', () => {
    it('returns 401 without auth', async () => {
      await request(app)
        .post(`${API}/auth/change-password`)
        .send({ currentPassword: 'x', newPassword: 'y' })
        .expect(401);
    });

    it('returns 400 when currentPassword or newPassword missing', async () => {
      await request(app)
        .post(`${API}/auth/change-password`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ newPassword: 'new1' })
        .expect(400);
      await request(app)
        .post(`${API}/auth/change-password`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ currentPassword: 'old' })
        .expect(400);
    });

    it('returns 401 when current password wrong', async () => {
      await request(app)
        .post(`${API}/auth/change-password`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ currentPassword: 'wrong', newPassword: 'new-pass' })
        .expect(401, { message: 'Current password is incorrect' });
    });

    it('returns 204 and allows login with new password', async () => {
      const newPassword = 'new-password-2';
      await request(app)
        .post(`${API}/auth/change-password`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ currentPassword: testUserPassword, newPassword })
        .expect(204);
      await request(app)
        .post(`${API}/auth/login`)
        .send({ email: testUserEmail, password: newPassword })
        .expect(200);
    });
  });
});
