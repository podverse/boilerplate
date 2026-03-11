import { expect, test } from '@playwright/test';

import {
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

test.describe('This suite verifies the management admin-edit-page for the admin (buckets:R bucket_admins events:all_admins) user.', () => {
  test('When an admin (buckets:R bucket_admins events:all_admins) opens the admin-edit-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin (buckets:R bucket_admins events:all_admins)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'The admin (buckets:R bucket_admins events:all_admins) sees not found when opening the admin-edit-page.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);
      }
    );
  });
});
