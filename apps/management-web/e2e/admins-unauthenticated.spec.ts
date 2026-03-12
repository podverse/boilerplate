import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { clickConfirmDeleteInModal } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('Management admins-list-page for the unauthenticated user', () => {
  test('When an unauthenticated user tries to open the admins-list-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admins-list-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/admins');
      }
    );
  });
});
