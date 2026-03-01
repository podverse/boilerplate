/**
 * Management API – rate limiting on auth endpoints.
 * Isolated from other test files so no prior login calls pollute the MemoryStore counter.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSource } from '@boilerplate/orm';
import { managementDataSource } from '@boilerplate/management-orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';

const API = config.apiVersionPath;
const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
/** In test env the strict limit is 100; send one more to trigger 429. */
const STRICT_LIMIT_IN_TEST = 100;

describe('management-api rate limiting', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    await appDataSource.initialize();
    await managementDataSource.initialize();
    app = createApp();
  });

  afterAll(async () => {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
    if (managementDataSource.isInitialized) {
      await managementDataSource.destroy();
    }
  });

  it('returns 429 after exceeding strict limit on POST /auth/login', async () => {
    for (let i = 0; i < STRICT_LIMIT_IN_TEST; i++) {
      const res = await request(app)
        .post(`${API}/auth/login`)
        .send({ email: `rate-${i}@example.com`, password: 'any' });
      expect([400, 401]).toContain(res.status);
    }
    const res = await request(app)
      .post(`${API}/auth/login`)
      .send({ email: 'over-limit@example.com', password: 'any' });
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    // Body is the single source of truth: exact seconds remaining from backend in-memory store.
    const retryAfterSeconds: unknown = res.body.retryAfterSeconds;
    expect(typeof retryAfterSeconds).toBe('number');
    expect(retryAfterSeconds as number).toBeGreaterThan(0);
  });
});
