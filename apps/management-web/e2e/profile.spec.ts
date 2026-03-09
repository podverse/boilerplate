import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Profile', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-profile-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/profile');
      }
    );
  });

  test('authenticated user sees profile or identity', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-profile-and-expect-single-redirect-to-settings',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /settings|account/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'management-profile-route-redirects-to-settings-page-for-authenticated-user'
    );
  });
});
