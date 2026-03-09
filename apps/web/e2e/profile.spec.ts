import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the user-profile-page.', () => {
  test('When an unauthenticated user tries to open the user-profile-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/profile',
      'User navigates to the user-profile-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When an authenticated user opens the user-profile-page, they see their profile or identity.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the user-profile-page and sees profile content or display name.',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page.getByText(/e2e user/i)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The user-profile-page is visible with user identity or heading.'
    );
  });
});
