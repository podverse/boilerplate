/**
 * Rate limiting on auth endpoints: strict endpoints return 429 when limit exceeded.
 * GET /me and POST /logout are not rate limited (see plan).
 *
 * Uses RATE_LIMIT_STRICT_FOR_TEST and RATE_LIMIT_MODERATE_FOR_TEST so real limits (100) apply.
 * Must set env before loading the app. We dynamic-import setup and app inside beforeAll so that
 * app.js (and thus the rate-limit middleware) is loaded only after env is set; a static import
 * of setup would pull in app.js at test load time, before beforeAll runs, and limiters would
 * get the default test limit (100k) instead of 100.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { config } from '../config/index.js';

const API = config.apiVersionPath;
const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
/** Use lower deterministic test limits so 429 assertions are reliable on slower machines. */
const STRICT_LIMIT_IN_TEST = 30;
const MODERATE_LIMIT_IN_TEST = 30;

const expectRetryAfterSeconds = (retryAfterSeconds: unknown): void => {
  expect(typeof retryAfterSeconds).toBe('number');
  if (typeof retryAfterSeconds === 'number') {
    expect(retryAfterSeconds).toBeGreaterThan(0);
  }
};

describe('auth rate limiting', () => {
  let app: ReturnType<Awaited<typeof import('../app.js')>['createApp']>;

  beforeAll(async () => {
    process.env.RATE_LIMIT_STRICT_FOR_TEST = 'true';
    process.env.RATE_LIMIT_MODERATE_FOR_TEST = 'true';
    process.env.RATE_LIMIT_STRICT_TEST_LIMIT = `${STRICT_LIMIT_IN_TEST}`;
    process.env.RATE_LIMIT_MODERATE_TEST_LIMIT = `${MODERATE_LIMIT_IN_TEST}`;
    // Keep signup route mounted for this suite so strict limiter assertions are not
    // masked by admin-only/no-mailer 403 behavior.
    process.env.MAILER_ENABLED = 'true';
    process.env.AUTH_MODE = 'self_signup';
    const setup = await import('./helpers/setup.js');
    await setup.initializeApiTestDataSources();
    const { createApp: createAppFn } = await import('../app.js');
    app = createAppFn();
  }, 60_000);

  afterAll(async () => {
    const setup = await import('./helpers/setup.js');
    await setup.destroyApiTestDataSources();
  }, 30_000);

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
    expectRetryAfterSeconds(res.body.retryAfterSeconds);
  }, 15_000);

  it('returns 429 after exceeding strict limit on POST /auth/signup', async () => {
    for (let i = 0; i < STRICT_LIMIT_IN_TEST; i++) {
      const res = await request(app)
        .post(`${API}/auth/signup`)
        .send({ email: `rate-signup-${i}@example.com`, password: 'any' });
      // Validation failures are expected before hitting the strict limiter threshold.
      expect(res.status).toBe(400);
    }
    const res = await request(app)
      .post(`${API}/auth/signup`)
      .send({ email: 'over-limit@example.com', password: 'any' });
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    expectRetryAfterSeconds(res.body.retryAfterSeconds);
  }, 15_000);

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
    expectRetryAfterSeconds(res.body.retryAfterSeconds);
  }, 15_000);

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
  }, 15_000);
});
