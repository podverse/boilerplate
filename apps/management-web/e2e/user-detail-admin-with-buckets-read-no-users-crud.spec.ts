import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

test.describe('This suite verifies the management user-detail-page for the admin with buckets read, no users CRUD user.', () => {
  test('When an admin without usersCrud (e.g. admin-with-bucket-admins) opens the user-detail-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no users CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/user/${E2E_MAIN_USER_ID}`);
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without usersCrud is redirected to the dashboard when opening the user-detail-page.'
    );
  });
});
