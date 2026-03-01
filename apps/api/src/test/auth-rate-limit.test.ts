/**
 * Rate limiting on auth endpoints: strict endpoints return 429 when limit exceeded.
 * GET /me and POST /logout are not rate limited (see plan).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSource } from '@boilerplate/orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';

const API = config.apiVersionPath;
const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
/** In test env both strict and moderate limits are 100; send one more to trigger 429. */
const STRICT_LIMIT_IN_TEST = 100;
const MODERATE_LIMIT_IN_TEST = 100;

describe('auth rate limiting', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    await appDataSource.initialize();
    app = createApp();
  });

  afterAll(async () => {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
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
