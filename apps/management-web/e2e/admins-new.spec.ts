import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Creating a new-management-admin.', () => {
  test('When an unauthenticated user tries to open the new admin page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admins new page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/admins/new');
      }
    );
  });

  test('When an authenticated user opens the new admin page, they see the add admin form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admins new route and sees the add admin form.',
      async () => {
        await page.goto('/admins/new');
      }
    );
    await expect(page).toHaveURL(/\/admins\/new/);
    await expect(page.getByRole('textbox', { name: /display name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /^username$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add admin|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management add admin form is visible with username and submit button.'
    );
  });
});
