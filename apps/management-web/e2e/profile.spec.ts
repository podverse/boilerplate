import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Management profile-page.', () => {
  test('When an unauthenticated user tries to open the profile-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management profile-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/profile');
      }
    );
  });

  test('When an authenticated user opens the profile-page, they are redirected to the settings-page and see profile or identity.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management profile-page and is redirected to settings.',
      async () => {
        await page.goto('/profile');
      }
    );
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /settings|account/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management profile route redirects to the settings-page for the authenticated user.'
    );
  });
});
