import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests for web app. Playwright auto-starts API (4010), sidecar (4011), and web (4012)
 * in production-like mode (`build` + `start`).
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
  webServer: [
    {
      command:
        'npm run build -w @boilerplate/api && API_PORT=4010 npm run start -w @boilerplate/api',
      port: 4010,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
    {
      command:
        'npm run build -w @boilerplate/web-sidecar && PORT=4011 NEXT_PUBLIC_API_URL=http://localhost:4010 npm run dev:sidecar -w @boilerplate/web',
      port: 4011,
      cwd: '../..',
      reuseExistingServer: false,
      timeout: 420_000,
    },
    {
      command:
        'PORT=4012 RUNTIME_CONFIG_URL=http://localhost:4011 npm run build -w @boilerplate/web && PORT=4012 RUNTIME_CONFIG_URL=http://localhost:4011 npm run start -w @boilerplate/web',
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
