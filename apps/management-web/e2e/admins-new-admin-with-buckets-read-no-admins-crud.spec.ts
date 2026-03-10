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

test.describe('This suite verifies the management admins-new-page for the admin with buckets read, no admins CRUD user.', () => {
  test('When an admin without adminsCrud create (e.g. admin-with-bucket-admins) opens the admins-new-page, they are redirected to the admins list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no admins CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/admins/new');
    await expect(page).toHaveURL(/\/admins/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without admins create is redirected to the admins list when opening the admins-new-page.'
    );
  });
});
