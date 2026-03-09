import { test, expect } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/**
 * Proof-of-concept E2E: login with seeded-super-admin and assert dashboard-page loads.
 * Requires e2e seed (e2e-superadmin@example.com / Test!1Aa) and management-api + management-web running.
 */
test.describe('This suite covers Management dashboard-page after login.', () => {
  test('When the user logs in with the seeded-super-admin account, the dashboard loads and shows the dashboard heading.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management login screen before authenticating with the seeded-super-admin.',
      async () => {
        await page.goto('/login');
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management login screen is fully rendered before entering super admin credentials.'
    );
    await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User fills the username field with the seeded-super-admin identity.',
      async () => {
        await page.getByRole('textbox', { name: /username|email/i }).fill('e2e-superadmin');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User fills the password field with the seeded-super-admin secret.',
      async () => {
        await page.getByLabel(/password/i).fill('Test!1Aa');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'User submits the management login form and is transitioned to the dashboard after successful authentication.',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management dashboard screen is visible with the primary heading after successful login.'
    );
  });
});
