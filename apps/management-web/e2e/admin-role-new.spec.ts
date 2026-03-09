import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Management admin role new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-admin-role-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/admins/roles/new');
      }
    );
  });

  test('authenticated user sees add role form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admin-role-new-route-and-expect-add-role-form-visible',
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
      'management-admin-role-new-form-visible-with-role-name-and-save'
    );
  });
});
