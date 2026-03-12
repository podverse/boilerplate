import { afterEach, describe, expect, it } from 'vitest';

import { validateStartupRequirements } from '../lib/startup/validation.js';

const ORIGINAL_ENV = { ...process.env };

const withEnv = (overrides: Record<string, string | undefined>): void => {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
};

const VALID_MANAGEMENT_JWT_SECRET = 'Z8p!2Lm#5Qv&1Nc@7Ty$4Hr%9Wd*3KsA';

describe('startup validation auth mode requirements (management-api)', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('rejects missing AUTH_MODE', () => {
    withEnv({
      AUTH_MODE: undefined,
      MANAGEMENT_JWT_SECRET: VALID_MANAGEMENT_JWT_SECRET,
    });
    expect(() => validateStartupRequirements()).toThrow();
  });

  it('rejects invalid AUTH_MODE values', () => {
    withEnv({
      AUTH_MODE: 'admin_only',
      MANAGEMENT_JWT_SECRET: VALID_MANAGEMENT_JWT_SECRET,
    });
    expect(() => validateStartupRequirements()).toThrow();
  });

  it('requires USER_INVITATION_TTL_HOURS to be positive integer', () => {
    withEnv({
      MANAGEMENT_JWT_SECRET: VALID_MANAGEMENT_JWT_SECRET,
      USER_INVITATION_TTL_HOURS: '0',
    });
    expect(() => validateStartupRequirements()).toThrow();
  });
});
