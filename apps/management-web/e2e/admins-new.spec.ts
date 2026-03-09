import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Management admins new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-admins-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/admins/new');
      }
    );
  });

  test('authenticated user sees add admin form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admins-new-route-and-expect-add-admin-form-visible',
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
      'management-add-admin-form-visible-with-username-and-submit'
    );
  });
});
