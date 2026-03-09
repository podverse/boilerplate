import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite covers Management bucket-messages-route redirect.', () => {
  test('When an unauthenticated user tries to open the bucket-messages-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-messages-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
      }
    );
  });

  test('When an authenticated user opens the bucket-messages-route, they are redirected to the bucket-detail-route.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management bucket-messages-route and is redirected to bucket detail.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}$`));
  });
});
