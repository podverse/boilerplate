/**
 * Management API – rate limiting on auth endpoints.
 * Isolated from other test files so no prior login calls pollute the MemoryStore counter.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { appDataSourceRead, appDataSourceReadWrite } from '@boilerplate/orm';
import { managementDataSource } from '@boilerplate/management-orm';
import { createApp } from '../app.js';
import { config } from '../config/index.js';

const API = config.apiVersionPath;
const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
/** In test env the strict limit is 100; send one more to trigger 429. */
const STRICT_LIMIT_IN_TEST = 100;

describe('management-api rate limiting', () => {
  let app: ReturnType<typeof createApp>;

  const postLoginWithRetry = async (username: string, password: string) => {
    try {
      return await request(app).post(`${API}/auth/login`).send({ username, password });
    } catch (error) {
      if (error instanceof Error && error.message.includes('socket hang up')) {
        return request(app).post(`${API}/auth/login`).send({ username, password });
      }
      throw error;
    }
  };

  beforeAll(async () => {
    await appDataSourceRead.initialize();
    await appDataSourceReadWrite.initialize();
    await managementDataSource.initialize();
    app = createApp();
  });

  afterAll(async () => {
    if (managementDataSource.isInitialized) {
      await managementDataSource.destroy();
    }
    if (appDataSourceReadWrite.isInitialized) {
      await appDataSourceReadWrite.destroy();
    }
    if (appDataSourceRead.isInitialized) {
      await appDataSourceRead.destroy();
    }
  });

  it('returns 429 after exceeding strict limit on POST /auth/login', async () => {
    for (let i = 0; i < STRICT_LIMIT_IN_TEST; i++) {
      const res = await postLoginWithRetry(`rate-${i}@example.com`, 'any');
      expect([400, 401]).toContain(res.status);
    }
    const res = await postLoginWithRetry('over-limit@example.com', 'any');
    expect(res.status).toBe(429);
    expect(res.body.message).toBe(RATE_LIMIT_MESSAGE);
    // Body is the single source of truth: exact seconds remaining from backend in-memory store.
    const retryAfterSeconds: unknown = res.body.retryAfterSeconds;
    expect(typeof retryAfterSeconds).toBe('number');
    expect(retryAfterSeconds as number).toBeGreaterThan(0);
  });
});
