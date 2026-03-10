import { expect, test } from '@playwright/test';

import { loginAsManagementAdminWithBucketAdmins } from './helpers/advancedFixtures';
import { capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the management buckets-new page for the admin with buckets read, no create user.', () => {
  test('When an admin with buckets read but without buckets create opens the buckets-new page, they are redirected to the buckets list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no create');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/buckets/new');
    await expect(page).toHaveURL(/\/buckets/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without buckets create is redirected to the buckets list when opening the buckets-new page.'
    );
  });
});
