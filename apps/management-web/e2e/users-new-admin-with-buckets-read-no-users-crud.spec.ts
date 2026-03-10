import { expect, test } from '@playwright/test';

import {
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management users-new-page for the admin with buckets read, no users CRUD user.', () => {
  test('When an admin without usersCrud create (e.g. admin-with-bucket-admins) opens the users-new-page, they are redirected to the users list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no users CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/users/new');
    await expect(page).toHaveURL(/\/users/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without users create is redirected to the users list when opening the users-new-page.'
    );
  });
});
