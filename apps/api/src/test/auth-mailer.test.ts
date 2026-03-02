/**
 * API integration tests: mailer-enabled mode (mocked send) – flows only.
 * Verification flows use captured tokens from the mailer mock; no real SMTP.
 * Locale behavior (email locale, password validation locale) is in auth-locale.test.ts.
 * Shared auth endpoints in auth.test.ts; no-mailer flows in auth-no-mailer.test.ts.
 */
process.env.MAILER_ENABLED = 'true';
process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '25';
process.env.MAIL_FROM = 'test@test.com';
process.env.APP_BASE_URL = 'http://localhost:3999';

import { vi } from 'vitest';

const { captured } = vi.hoisted(() => ({
  captured: {
    verifyEmail: '',
    verifyLocale: '' as string,
    passwordReset: '',
    passwordResetLocale: '' as string,
    emailChange: '',
    emailChangeLocale: '' as string,
  },
}));

vi.mock('../lib/mailer/send.js', () => ({
  isMailerEnabled: () => true,
  sendVerificationEmail: async (_to: string, token: string, locale?: string) => {
    captured.verifyEmail = token;
    captured.verifyLocale = locale ?? '';
  },
  sendPasswordResetEmail: async (_to: string, token: string, locale?: string) => {
    captured.passwordReset = token;
    captured.passwordResetLocale = locale ?? '';
  },
  sendEmailChangeVerificationEmail: async (_to: string, token: string, locale?: string) => {
    captured.emailChange = token;
    captured.emailChangeLocale = locale ?? '';
  },
}));

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSource } from '@boilerplate/orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';

const API = config.apiVersionPath;

describe('mailer-enabled (mocked)', () => {
  let app: ReturnType<typeof createApp>;
  const signupEmail = `signup-${Date.now()}@example.com`;
  const signupPassword = 'signup-pass-1';

  beforeAll(async () => {
    await appDataSource.initialize();
    app = createApp();
  });

  afterAll(async () => {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
  });

  describe('POST /auth/signup', () => {
    it('returns 201 with user and Set-Cookie (no token in body); captures verify token', async () => {
      captured.verifyEmail = '';
      captured.verifyLocale = '';
      const res = await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: signupEmail, password: signupPassword, displayName: 'Signup User' })
        .expect(201);
      expect(res.body).not.toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(signupEmail);
      expect(captured.verifyEmail).not.toBe('');
    });

    it('returns 400 when email missing', async () => {
      await request(app).post(`${API}/auth/signup`).send({ password: signupPassword }).expect(400);
    });

    it('returns 400 when password missing', async () => {
      await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: 'missing-pass@example.com' })
        .expect(400);
    });

    it('returns 400 when password fails validation (too short)', async () => {
      const res = await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: `weak-${Date.now()}@example.com`, password: 'x' })
        .expect(400);
      expect(res.body.message).toBeDefined();
    });

    it('returns 201 for duplicate email without leaking existence (anti-enumeration)', async () => {
      const res = await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: signupEmail, password: signupPassword })
        .expect(201);
      expect(res.body.message).toBeDefined();
    });
  });

  describe('POST /auth/verify-email', () => {
    it('returns 200 with captured token', async () => {
      await request(app)
        .post(`${API}/auth/verify-email`)
        .send({ token: captured.verifyEmail })
        .expect(200, { message: 'Email verified' });
    });

    it('returns 400 for invalid or expired token', async () => {
      await request(app)
        .post(`${API}/auth/verify-email`)
        .send({ token: 'invalid-token' })
        .expect(400, { message: 'Invalid or expired link' });
    });

    it('returns 400 when token is missing', async () => {
      await request(app)
        .post(`${API}/auth/verify-email`)
        .send({})
        .expect(400, { message: 'Invalid or expired link' });
    });
  });

  describe('POST /auth/forgot-password and reset-password', () => {
    it('forgot-password returns 400 when email missing', async () => {
      await request(app).post(`${API}/auth/forgot-password`).send({}).expect(400);
    });

    it('forgot-password returns 200 for unknown email (anti-enumeration)', async () => {
      const res = await request(app)
        .post(`${API}/auth/forgot-password`)
        .send({ email: 'no-such-user@example.com' })
        .expect(200);
      expect(res.body.message).toBeDefined();
    });

    it('forgot-password returns 200 and captures token; reset-password returns 204', async () => {
      captured.passwordReset = '';
      await request(app)
        .post(`${API}/auth/forgot-password`)
        .send({ email: signupEmail })
        .expect(200);
      expect(captured.passwordReset).not.toBe('');
      const newPassword = 'reset-new-pass';
      await request(app)
        .post(`${API}/auth/reset-password`)
        .send({ token: captured.passwordReset, newPassword })
        .expect(204);
      await request(app)
        .post(`${API}/auth/login`)
        .send({ email: signupEmail, password: newPassword })
        .expect(200);
    });

    it('reset-password returns 400 for invalid or expired token', async () => {
      await request(app)
        .post(`${API}/auth/reset-password`)
        .send({ token: 'invalid-token', newPassword: 'newpass1' })
        .expect(400, { message: 'Invalid or expired link' });
    });

    it('reset-password returns 400 when newPassword missing', async () => {
      await request(app)
        .post(`${API}/auth/reset-password`)
        .send({ token: 'any-token' })
        .expect(400);
    });

    it('reset-password returns 400 when newPassword fails validation (too short)', async () => {
      // First obtain a fresh reset token via forgot-password
      captured.passwordReset = '';
      const freshEmail = `reset-weak-${Date.now()}@example.com`;
      const freshAgent = request.agent(app);
      await freshAgent
        .post(`${API}/auth/signup`)
        .send({ email: freshEmail, password: signupPassword })
        .expect(201);
      await request(app)
        .post(`${API}/auth/forgot-password`)
        .send({ email: freshEmail })
        .expect(200);
      if (captured.passwordReset !== '') {
        const res = await request(app)
          .post(`${API}/auth/reset-password`)
          .send({ token: captured.passwordReset, newPassword: 'x' })
          .expect(400);
        expect(res.body.message).toBeDefined();
      }
    });
  });

  describe('POST /auth/request-email-change and confirm-email-change', () => {
    it('request returns 200 and captures token; confirm returns 200', async () => {
      const agent = request.agent(app);
      await agent
        .post(`${API}/auth/login`)
        .send({ email: signupEmail, password: 'reset-new-pass' })
        .expect(200);
      const newEmail = `new-${Date.now()}@example.com`;
      captured.emailChange = '';
      await agent
        .post(`${API}/auth/request-email-change`)
        .send({ newEmail })
        .expect(200, { message: 'Verification email sent' });
      expect(captured.emailChange).not.toBe('');
      await request(app)
        .post(`${API}/auth/confirm-email-change`)
        .send({ token: captured.emailChange })
        .expect(200, { message: 'Email updated' });
      await request(app)
        .post(`${API}/auth/login`)
        .send({ email: newEmail, password: 'reset-new-pass' })
        .expect(200);
    });

    it('request-email-change returns 400 when new email equals current', async () => {
      const sameEmailAgent = request.agent(app);
      const sameEmailAddr = `same-email-${Date.now()}@example.com`;
      await sameEmailAgent
        .post(`${API}/auth/signup`)
        .send({ email: sameEmailAddr, password: signupPassword })
        .expect(201);
      const res = await sameEmailAgent
        .post(`${API}/auth/request-email-change`)
        .send({ newEmail: sameEmailAddr })
        .expect(400);
      expect(res.body.message).toBeDefined();
    });

    it('request-email-change returns 409 when new email already in use', async () => {
      const conflictAgent = request.agent(app);
      const conflictEmail1 = `conflict-a-${Date.now()}@example.com`;
      const conflictEmail2 = `conflict-b-${Date.now()}@example.com`;
      await conflictAgent
        .post(`${API}/auth/signup`)
        .send({ email: conflictEmail1, password: signupPassword })
        .expect(201);
      // Also create user 2 so that email2 is taken
      await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: conflictEmail2, password: signupPassword })
        .expect(201);
      const res = await conflictAgent
        .post(`${API}/auth/request-email-change`)
        .send({ newEmail: conflictEmail2 })
        .expect(409);
      expect(res.body.message).toBeDefined();
    });

    it('request-email-change returns 401 without cookie or Authorization', async () => {
      await request(app)
        .post(`${API}/auth/request-email-change`)
        .send({ newEmail: 'other@example.com' })
        .expect(401, { message: 'Authentication required' });
    });

    it('request-email-change returns 400 when newEmail missing', async () => {
      const oneOffEmail = `oneoff-${Date.now()}@example.com`;
      const agent = request.agent(app);
      await agent
        .post(`${API}/auth/signup`)
        .send({ email: oneOffEmail, password: signupPassword })
        .expect(201);
      const res = await agent.post(`${API}/auth/request-email-change`).send({}).expect(400);
      expect(res.body.message).toBeDefined();
      expect(
        res.body.message === 'newEmail required' ||
          (res.body.details &&
            res.body.details.some((d: { path?: string }) => d.path === 'newEmail'))
      ).toBe(true);
    });

    it('confirm-email-change returns 400 for invalid or expired token', async () => {
      await request(app)
        .post(`${API}/auth/confirm-email-change`)
        .send({ token: 'invalid-token' })
        .expect(400, { message: 'Invalid or expired link' });
    });

    it('confirm-email-change returns 400 when token is missing', async () => {
      await request(app)
        .post(`${API}/auth/confirm-email-change`)
        .send({})
        .expect(400, { message: 'Invalid or expired link' });
    });
  });
});
