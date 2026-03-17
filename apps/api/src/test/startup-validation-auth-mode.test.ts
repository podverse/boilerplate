import { TEST_JWT_SECRET_API } from '@boilerplate/helpers';
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

describe('startup validation auth mode requirements (api)', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('rejects invalid AUTH_MODE values', () => {
    withEnv({
      AUTH_MODE: 'admin_only',
      JWT_SECRET: TEST_JWT_SECRET_API,
    });
    expect(() => validateStartupRequirements()).toThrow();
  });

  it('requires mailer env when AUTH_MODE=admin_only_email', () => {
    withEnv({
      AUTH_MODE: 'admin_only_email',
      JWT_SECRET: TEST_JWT_SECRET_API,
      SMTP_HOST: undefined,
      SMTP_PORT: undefined,
      MAIL_FROM: undefined,
      APP_BASE_URL: undefined,
    });
    expect(() => validateStartupRequirements()).toThrow();
  });

  it('does not fail startup when optional mailer env is set in admin_only_username mode', () => {
    withEnv({
      AUTH_MODE: 'admin_only_username',
      JWT_SECRET: TEST_JWT_SECRET_API,
      SMTP_HOST: 'localhost',
      SMTP_PORT: '25',
      MAIL_FROM: 'test@test.com',
      APP_BASE_URL: 'http://localhost:3999',
    });
    expect(() => validateStartupRequirements()).not.toThrow();
  });
});
