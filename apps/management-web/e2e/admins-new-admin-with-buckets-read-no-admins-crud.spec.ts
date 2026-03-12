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

test.describe('Management admins-new-page for the admin (buckets:R bucket_admins events:all_admins) user', () => {
  test('When an admin (buckets:R bucket_admins events:all_admins) opens the admins-new-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin (buckets:R bucket_admins events:all_admins)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/admins/new');
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin (buckets:R bucket_admins events:all_admins) is redirected to the dashboard when opening the admins-new-page.'
    );
  });
});
