import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/**
 * Home smoke: unauthenticated `/` redirects to login-page; authenticated `/` redirects to dashboard.
 */
test.describe('This suite verifies the management home-page unauthenticated and authenticated redirect behavior.', () => {
  test('When an unauthenticated user visits the home-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User visits the management home-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
      }
    );
    await capturePageLoad(page, testInfo, 'The login-page is visible after redirect.');
  });

  test('When an authenticated user visits the home-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-super-admin');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User visits the management home-page while logged in and is redirected to the dashboard.',
      async () => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      }
    );
    await capturePageLoad(page, testInfo, 'The dashboard is visible after redirect.');
  });
});
