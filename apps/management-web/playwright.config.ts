import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests for management-web app. Playwright auto-starts management-api (4110)
 * and management-web (4112) in production-like mode (`build` + `start`).
 * See docs/testing/E2E-PAGE-TESTING.md.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: '../../.artifacts/e2e-test-results/management-web',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  webServer: [
    {
      command:
        'npm run build -w @boilerplate/management-api && NODE_ENV=test MANAGEMENT_API_PORT=4110 MANAGEMENT_DB_HOST=localhost MANAGEMENT_DB_PORT=5532 MANAGEMENT_DB_NAME=boilerplate_management_test MANAGEMENT_DB_USERNAME=read_write MANAGEMENT_DB_PASSWORD=test DB_HOST=localhost DB_PORT=5532 DB_NAME=boilerplate_test DB_READ_USERNAME=read DB_READ_PASSWORD=test DB_READ_WRITE_USERNAME=read_write DB_READ_WRITE_PASSWORD=test VALKEY_HOST=localhost VALKEY_PORT=6479 VALKEY_PASSWORD=test npm run start -w @boilerplate/management-api',
      port: 4110,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
    {
      command:
        'PORT=4112 MANAGEMENT_API_BACKEND_URL=http://localhost:4110 NEXT_PUBLIC_MANAGEMENT_API_URL=/api/management NEXT_PUBLIC_WEB_APP_URL=http://localhost:4012 npm run build -w @boilerplate/management-web && PORT=4112 MANAGEMENT_API_BACKEND_URL=http://localhost:4110 NEXT_PUBLIC_MANAGEMENT_API_URL=/api/management NEXT_PUBLIC_WEB_APP_URL=http://localhost:4012 npm run start -w @boilerplate/management-web',
      port: 4112,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4112',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
