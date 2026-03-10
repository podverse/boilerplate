import { expect, test } from '@playwright/test';

import {
  createBucketMessageFixture,
  getCookieHeaderFromPage,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite verifies the management bucket-message-edit-page for the admin with buckets read, no message update user.', () => {
  test('When an admin with buckets read but without bucketMessagesCrud update opens the bucket-message-edit-page, they are redirected to the buckets list.', async ({
    page,
    request,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no message update');
    await loginAsManagementSuperAdmin(page);
    const cookieHeader = await getCookieHeaderFromPage(page);
    const { id: messageId } = await createBucketMessageFixture(
      request,
      E2E_BUCKET1_ID,
      { body: 'E2E message for redirect test', senderName: 'E2E Sender' },
      { cookieHeader }
    );
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/${messageId}/edit`);
    await expect(page).toHaveURL(/\/buckets/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without message-update permission is redirected to the buckets list when opening the bucket-message-edit-page.'
    );
  });

  test('When an admin without bucketMessagesCrud update opens bucket-message-edit with an invalid message id, they are redirected to the buckets list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no message update');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages/99999999-9999-4999-a999-999999999999/edit`);
    await expect(page).toHaveURL(/\/buckets/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without message-update permission is redirected to buckets for an invalid message id as well.'
    );
  });
});
