/**
 * Rate limiting on auth endpoints: strict endpoints return 429 when limit exceeded.
 * GET /me and POST /logout are not rate limited (see plan).
 *
 * Uses RATE_LIMIT_STRICT_FOR_TEST and RATE_LIMIT_MODERATE_FOR_TEST so real limits (100) apply.
 * Must set env before loading the app (dynamic import in beforeAll).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSourceRead, appDataSourceReadWrite } from '@boilerplate/orm';
import { config } from '../config/index.js';

const API = config.apiVersionPath;
const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
/** In test env when RATE_LIMIT_*_FOR_TEST=true the limit is 100; send one more to trigger 429. */
const STRICT_LIMIT_IN_TEST = 100;
const MODERATE_LIMIT_IN_TEST = 100;

describe('auth rate limiting', () => {
  let app: ReturnType<Awaited<typeof import('../app.js')>['createApp']>;

  beforeAll(async () => {
    process.env.RATE_LIMIT_STRICT_FOR_TEST = 'true';
    process.env.RATE_LIMIT_MODERATE_FOR_TEST = 'true';
    await appDataSourceRead.initialize();
    await appDataSourceReadWrite.initialize();
    const { createApp: createAppFn } = await import('../app.js');
    app = createAppFn();
  });

  afterAll(async () => {
    if (appDataSourceReadWrite.isInitialized) {
      await appDataSourceReadWrite.destroy();
    }
    if (appDataSourceRead.isInitialized) {
      await appDataSourceRead.destroy();
    }
  });

  it('returns 429 after exceeding strict limit on POST /auth/login', async () => {
    for (let i = 0; i < STRICT_LIMIT_IN_TEST; i++) {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: 'any@example.com', password: 'any' });
      expect([400, 401]).toContain(res.status);
    }
    const res = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: 'any@example.com', password: 'any' });
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    // Body is the single source of truth: exact seconds remaining from backend in-memory store.
    const retryAfterSeconds: unknown = res.body.retryAfterSeconds;
    expect(typeof retryAfterSeconds).toBe('number');
    expect(retryAfterSeconds as number).toBeGreaterThan(0);
  });

  it('returns 429 after exceeding strict limit on POST /auth/signup', async () => {
    for (let i = 0; i < STRICT_LIMIT_IN_TEST; i++) {
      const res = await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: `rate-signup-${i}@example.com`, password: 'any' });
      // Depending on mailer mode: 400/403/201; any non-429 is valid before limit
      expect(res.status).not.toBe(429);
    }
    const res = await request(app)
      .post(`${API}/auth/signup`)
      .send({ email: 'over-limit@example.com', password: 'any' });
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    const retryAfterSeconds: unknown = res.body.retryAfterSeconds;
    expect(typeof retryAfterSeconds).toBe('number');
    expect(retryAfterSeconds as number).toBeGreaterThan(0);
  });

  it('returns 429 after exceeding moderate limit on POST /auth/change-password', async () => {
    // change-password rate limiter runs before auth; unauthenticated requests count toward limit
    for (let i = 0; i < MODERATE_LIMIT_IN_TEST; i++) {
      const res = await request(app)
        .post(`${API}/auth/change-password`)
        .send({ currentPassword: 'any', newPassword: 'any' });
      expect([400, 401]).toContain(res.status);
    }
    const res = await request(app)
      .post(`${API}/auth/change-password`)
      .send({ currentPassword: 'any', newPassword: 'any' });
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    const retryAfterSeconds: unknown = res.body.retryAfterSeconds;
    expect(typeof retryAfterSeconds).toBe('number');
    expect(retryAfterSeconds as number).toBeGreaterThan(0);
  });

  it('GET /auth/me is not rate limited (many requests succeed with 401)', async () => {
    for (let i = 0; i < 15; i++) {
      const res = await request(app).get(`${API}/auth/me`);
      expect(res.status).toBe(401);
    }
  });

  it('POST /auth/logout is not rate limited (many requests succeed with 204)', async () => {
    for (let i = 0; i < 15; i++) {
      const res = await request(app).post(`${API}/auth/logout`);
      expect(res.status).toBe(204);
    }
  });
});
