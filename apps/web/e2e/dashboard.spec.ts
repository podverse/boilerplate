import { test, expect } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

/**
 * Proof-of-concept E2E: login with seeded user and assert dashboard page loads with expected content.
 * Requires e2e seed (e2e@example.com / Test!1Aa) and API + web running.
 */
test.describe('Dashboard', () => {
  test('loads after login and shows dashboard heading', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-login-screen-before-authenticating-seeded-e2e-user',
      async () => {
        await page.goto('/login');
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'login-screen-is-fully-rendered-before-entering-credentials'
    );
    await actionAndCapture(
      page,
      testInfo,
      'populate-email-or-username-field-with-seeded-e2e-user-identity',
      async () => {
        await page.getByLabel(/email/i).fill('e2e@example.com');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'populate-password-field-with-seeded-e2e-user-secret-for-authentication',
      async () => {
        await page.getByLabel(/password/i).fill('Test!1Aa');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'submit-login-form-and-transition-to-dashboard-after-successful-authentication',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'dashboard-screen-is-visible-with-primary-heading-after-successful-login'
    );
  });
});
