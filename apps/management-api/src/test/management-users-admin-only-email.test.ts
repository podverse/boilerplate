process.env.AUTH_MODE = 'admin_only_email';

import crypto from 'crypto';
import type { Express } from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type request from 'supertest';

import { VerificationToken, appDataSourceRead } from '@boilerplate/orm';

/** Unique per file to avoid collisions when tests run in parallel. */
const FILE_PREFIX = 'mgmt-users-admin-only';

describe('management users in admin_only_email mode', () => {
  let app: Express;
  let API: string;
  let superAdminAgent: ReturnType<typeof request.agent>;
  let invitationTtlHours = 24;
  const superAdminUsername = `${FILE_PREFIX}-super-admin`;
  const superAdminPassword = `${FILE_PREFIX}-super-admin-password-1`;

  beforeAll(async () => {
    const configMod = await import('../config/index.js');
    const setupMod = await import('./helpers/setup.js');
    const loginAgentMod = await import('./helpers/login-agent.js');
    API = configMod.config.apiVersionPath;
    invitationTtlHours = configMod.config.userInvitationTtlHours;
    app = await setupMod.createManagementApiTestAppWithSuperAdmin(
      superAdminUsername,
      superAdminPassword
    );
    superAdminAgent = await loginAgentMod.createManagementLoginAgent(app, {
      username: superAdminUsername,
      password: superAdminPassword,
    });
  });

  afterAll(async () => {
    const setupMod = await import('./helpers/setup.js');
    await setupMod.destroyManagementApiTestDataSources();
  });

  it('POST /users without password returns invite link with expected TTL', async () => {
    const email = `${FILE_PREFIX}-user-${Date.now()}@example.com`;
    const startedAtMs = Date.now();
    const res = await superAdminAgent
      .post(`${API}/users`)
      .send({ email, displayName: 'Admin Only Email Invite User' })
      .expect(201);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
    expect(typeof res.body.setPasswordLink).toBe('string');
    expect(res.body.setPasswordLink).toContain('/auth/set-password');

    const setPasswordUrl = new URL(res.body.setPasswordLink, 'http://localhost');
    const rawToken = setPasswordUrl.searchParams.get('token');
    expect(rawToken).toBeTruthy();
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken ?? '', 'utf8')
      .digest('hex');

    const verificationTokenRepo = appDataSourceRead.getRepository(VerificationToken);
    const tokenRecord = await verificationTokenRepo.findOne({
      where: { tokenHash, kind: 'set_password', userId: res.body.user.id },
    });
    expect(tokenRecord).not.toBeNull();
    if (tokenRecord !== null) {
      const expectedTtlMs = invitationTtlHours * 60 * 60 * 1000;
      const elapsedMs = tokenRecord.expiresAt.getTime() - startedAtMs;
      const lowerBound = expectedTtlMs - 60 * 1000;
      const upperBound = expectedTtlMs + 60 * 1000;
      expect(elapsedMs).toBeGreaterThanOrEqual(lowerBound);
      expect(elapsedMs).toBeLessThanOrEqual(upperBound);
    }

    await superAdminAgent.delete(`${API}/users/${res.body.user.id}`).expect(204);
  });
});
