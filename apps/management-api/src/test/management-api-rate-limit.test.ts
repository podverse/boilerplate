/**
 * Management API – rate limiting on auth endpoints.
 * Sets RATE_LIMIT_STRICT_FOR_TEST=true and loads the app via dynamic import so real limit (100)
 * applies; other test files never set this and get a very high limit, so no cross-file flakiness.
 * Must set env before loading the app. We dynamic-import setup and app inside beforeAll so that
 * app.js (and thus the rate-limit middleware) is loaded only after env is set; a static import
 * of setup would pull in app.js at test load time, before beforeAll runs, and the limiter would
 * get the default test limit (100k) instead of 100.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { config } from '../config/index.js';

const API = config.apiVersionPath;
const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
/** In test env when RATE_LIMIT_STRICT_FOR_TEST=true the limit is 100; send one more to trigger 429. */
const STRICT_LIMIT_IN_TEST = 100;

describe('management-api rate limiting', () => {
  let app: ReturnType<Awaited<typeof import('../app.js')>['createApp']>;

  const postLoginWithRetry = async (
    username: string,
    password: string,
    opts?: { retryOnceOn404?: boolean }
  ) => {
    try {
      const res = await request(app).post(`${API}/auth/login`).send({ username, password });
      // Transient 404 can occur when running this test back-to-back (e.g. E2E report commands).
      if (res.status === 404 && opts?.retryOnceOn404 === true) {
        return request(app).post(`${API}/auth/login`).send({ username, password });
      }
      return res;
    } catch (error) {
      if (error instanceof Error && error.message.includes('socket hang up')) {
        return request(app).post(`${API}/auth/login`).send({ username, password });
      }
      throw error;
    }
  };

  beforeAll(async () => {
    process.env.RATE_LIMIT_STRICT_FOR_TEST = 'true';
    const setup = await import('./helpers/setup.js');
    await setup.initializeManagementApiTestDataSources();
    const { createApp: createAppFn } = await import('../app.js');
    app = createAppFn();
  }, 60_000);

  afterAll(async () => {
    const setup = await import('./helpers/setup.js');
    await setup.destroyManagementApiTestDataSources();
  }, 30_000);

  it('returns 429 after exceeding strict limit on POST /auth/login', async () => {
    for (let i = 0; i < STRICT_LIMIT_IN_TEST; i++) {
      const res = await postLoginWithRetry(`rate-${i}@example.com`, 'any', {
        retryOnceOn404: true,
      });
      expect([400, 401]).toContain(res.status);
    }
    const res = await postLoginWithRetry('over-limit@example.com', 'any');
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    // Body is the single source of truth: exact seconds remaining from backend in-memory store.
    const retryAfterSeconds: unknown = res.body.retryAfterSeconds;
    expect(typeof retryAfterSeconds).toBe('number');
    if (typeof retryAfterSeconds === 'number') {
      expect(retryAfterSeconds).toBeGreaterThan(0);
    }
  }, 15_000);
});
