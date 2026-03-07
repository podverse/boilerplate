import { test, expect } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

/**
 * Proof-of-concept E2E: login with seeded super admin and assert dashboard page loads.
 * Requires e2e seed (e2e-superadmin@example.com / Test!1Aa) and management-api + management-web running.
 */
test.describe('Dashboard', () => {
  test('loads after login and shows dashboard heading', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-login-screen-before-authenticating-seeded-super-admin-user',
      async () => {
        await page.goto('/login');
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'management-login-screen-is-fully-rendered-before-entering-super-admin-credentials'
    );
    await actionAndCapture(
      page,
      testInfo,
      'populate-management-username-field-with-seeded-super-admin-identity',
      async () => {
        await page.getByRole('textbox', { name: /username|email/i }).fill('e2e-superadmin');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'populate-management-password-field-with-seeded-super-admin-secret-for-authentication',
      async () => {
        await page.getByLabel(/password/i).fill('Test!1Aa');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'submit-management-login-form-and-transition-to-dashboard-after-successful-authentication',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-dashboard-screen-is-visible-with-primary-heading-after-successful-login'
    );
  });
});
