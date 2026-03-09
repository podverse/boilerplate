import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Profile', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/profile',
      'navigate-to-profile-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees profile or identity', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-profile-expect-profile-content-or-display-name',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page.getByText(/e2e user/i)).toBeVisible();
    await capturePageLoad(page, testInfo, 'profile-page-visible-with-user-identity-or-heading');
  });
});
