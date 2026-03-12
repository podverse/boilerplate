import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests for web app with signup + verification flows enabled
 * (AUTH_MODE=user_signup_email).
 * API sends verification/reset emails to Mailpit (SMTP 1025). Start Mailpit via: make e2e_mailpit_up.
 * Same ports as default config (4010, 4011, 4012). Run signup-enabled auth specs via make e2e_test_web_signup_enabled.
 * See docs/testing/E2E-PAGE-TESTING.md.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: '../../.artifacts/e2e-test-results/web',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 5_000,
  webServer: [
    {
      command:
        'npm run build -w @boilerplate/api && NODE_OPTIONS="--disable-warning=DEP0060" NODE_ENV=test AUTH_MODE=user_signup_email SMTP_HOST=localhost SMTP_PORT=1025 MAIL_FROM=test@test.com APP_BASE_URL=http://localhost:4010 API_PORT=4010 DB_HOST=localhost DB_PORT=5532 DB_NAME=boilerplate_test DB_READ_USERNAME=read DB_READ_PASSWORD=test DB_READ_WRITE_USERNAME=read_write DB_READ_WRITE_PASSWORD=test VALKEY_HOST=localhost VALKEY_PORT=6479 VALKEY_PASSWORD=test npm run start -w @boilerplate/api',
      port: 4010,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
    {
      command:
        'npm run build -w @boilerplate/web-sidecar && NODE_OPTIONS="--disable-warning=DEP0060" PORT=4011 NEXT_PUBLIC_API_URL=http://localhost:4010 NEXT_PUBLIC_AUTH_MODE=user_signup_email npm run dev:sidecar -w @boilerplate/web',
      port: 4011,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
    {
      command:
        'PORT=4012 RUNTIME_CONFIG_URL=http://localhost:4011 NEXT_PUBLIC_API_URL=http://localhost:4010 NEXT_PUBLIC_AUTH_MODE=user_signup_email npm run build -w @boilerplate/web && NODE_OPTIONS="--disable-warning=DEP0060" PORT=4012 RUNTIME_CONFIG_URL=http://localhost:4011 NEXT_PUBLIC_API_URL=http://localhost:4010 NEXT_PUBLIC_AUTH_MODE=user_signup_email npm run start -w @boilerplate/web',
      port: 4012,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4012',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
