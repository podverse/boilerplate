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

test.describe('This suite verifies the management admin-edit-page for the admin with buckets read, no admins CRUD user.', () => {
  test('When an admin without adminsCrud (e.g. admin-with-bucket-admins) opens the admin-edit-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no admins CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'The admin without adminsCrud sees not found when opening the admin-edit-page.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);
      }
    );
  });
});
