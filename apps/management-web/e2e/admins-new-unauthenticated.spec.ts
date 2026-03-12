import { expect, test } from '@playwright/test';

import {
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/** Password that satisfies strength requirements for create-admin. */
const E2E_VALID_PASSWORD = 'Test!1Aa';

test.describe('Management admins-new-page for the unauthenticated user', () => {
  test('When an unauthenticated user tries to open the admins-new-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admins-new-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/admins/new');
      }
    );
  });
});
