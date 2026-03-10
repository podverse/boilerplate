import { expect, test } from '@playwright/test';

import {
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management admin-role-new-page for the admin with buckets read, no admins CRUD user.', () => {
  test('When an admin without adminsCrud create (e.g. admin-with-bucket-admins) opens the admin-role-new-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no admins CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/admins/roles/new');
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without admins create is redirected to the dashboard when opening the admin-role-new-page.'
    );
  });
});
