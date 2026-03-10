import { test, expect } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management dashboard-page for the super-admin (full CRUD) user.', () => {
  test('When the user logs in with the seeded-super-admin account, the dashboard-page loads and shows the dashboard heading.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management login-page before authenticating with the seeded-super-admin.',
      async () => {
        await page.goto('/login');
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management login-page is fully rendered before entering super-admin credentials.'
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
      'User submits the management login-form and is transitioned to the dashboard after successful authentication.',
      async () => {
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management dashboard-page is visible with the primary heading after successful login.'
    );
  });
});
