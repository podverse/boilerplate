import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Creating a new-management-admin-role.', () => {
  test('When an unauthenticated user tries to open the new admin role page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admin role new page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/admins/roles/new');
      }
    );
  });

  test('When an authenticated user opens the new admin role page, they see the add role form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admin role new route and sees the add role form.',
      async () => {
        await page.goto('/admins/roles/new');
      }
    );
    await expect(page).toHaveURL(/\/admins\/roles\/new/);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create|add role/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management admin role new form is visible with role name and save button.'
    );
  });
});
