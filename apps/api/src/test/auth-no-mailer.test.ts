/**
 * API integration tests: no-mailer mode (admin-only).
 * Mailer is disabled; signup returns 403 and verification routes return 403.
 * Shared auth behavior is in auth.test.ts; mailer-enabled flows in auth-mailer.test.ts.
 */
import { afterAll, beforeAll, describe, it } from 'vitest';
import request from 'supertest';

import { UserService } from '@boilerplate/orm';
import { config } from '../config/index.js';
import { hashPassword } from '../lib/auth/hash.js';
import { createApiLoginAgent } from './helpers/login-agent.js';
import { createApiTestApp, destroyApiTestDataSources } from './helpers/setup.js';

const API = config.apiVersionPath;

describe('no-mailer (admin-only)', () => {
  let app: Awaited<ReturnType<typeof createApiTestApp>>;
  let authAgent: ReturnType<typeof request.agent>;
  const testUserEmail = `no-mailer-${Date.now()}@example.com`;
  const testUserPassword = 'test-password-1';

  beforeAll(async () => {
    app = await createApiTestApp();
    const hashed = await hashPassword(testUserPassword);
    await UserService.create({
      email: testUserEmail,
      password: hashed,
      displayName: 'No-Mailer User',
    });
    authAgent = await createApiLoginAgent(app, {
      email: testUserEmail,
      password: testUserPassword,
    });
  });

  afterAll(async () => {
    await destroyApiTestDataSources();
  });

  describe('POST /auth/signup returns 403 when signup disabled', () => {
    it('returns 403', async () => {
      await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: 'new@example.com', username: 'newuser', password: 'pass' })
        .expect(403, { message: 'Registration is by admin only' });
    });
  });

  describe('verification routes return 403 when mailer disabled', () => {
    it('POST /auth/verify-email returns 403', async () => {
      await request(app)
        .post(`${API}/auth/verify-email`)
        .send({ token: 'any' })
        .expect(403, { message: 'Email verification is not enabled' });
    });

    it('POST /auth/forgot-password returns 403', async () => {
      await request(app)
        .post(`${API}/auth/forgot-password`)
        .send({ email: 'a@b.com' })
        .expect(403, { message: 'Email verification is not enabled' });
    });

    it('POST /auth/reset-password returns 403', async () => {
      await request(app)
        .post(`${API}/auth/reset-password`)
        .send({ token: 'any', newPassword: 'new' })
        .expect(403, { message: 'Email verification is not enabled' });
    });

    it('POST /auth/request-email-change returns 403', async () => {
      await authAgent
        .post(`${API}/auth/request-email-change`)
        .send({ newEmail: 'other@example.com' })
        .expect(403, { message: 'Email verification is not enabled' });
    });

    it('POST /auth/confirm-email-change returns 403', async () => {
      await request(app)
        .post(`${API}/auth/confirm-email-change`)
        .send({ token: 'any' })
        .expect(403, { message: 'Email verification is not enabled' });
    });
  });
});
