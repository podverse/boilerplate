import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite verifies the management bucket-child-new-page for the admin with buckets read, no create user.', () => {
  test('When an admin with buckets read but without buckets create opens the bucket-child-new page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no create');
    await loginAsManagementAdminWithBucketAdmins(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User opens the bucket-child-new page without buckets create permission and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
  });
});
