import { expect, test } from '@playwright/test';

import { loginAsManagementAdminWithBucketAdmins } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite verifies the management bucket-messages-page for the admin with buckets read (bucket-admins permission) user.', () => {
  test('When an admin with buckets read opens the bucket-messages route with an invalid bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-messages route with an invalid bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/99999999-9999-4999-a999-999999999999/messages');
      }
    );
  });

  test('When an admin with buckets read opens the bucket-messages route, they are redirected to the bucket-detail-page and can see the messages tab.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}(?:/|$)`));
    await expect(page.getByRole('link', { name: /messages/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admin with buckets read sees the bucket-detail-page and messages tab.'
    );
  });

  test('When an admin with buckets read opens bucket-detail with tab=messages, they see messages content.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to bucket-detail with tab=messages and sees the messages panel.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}?tab=messages`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    const emptyState = page.getByText(/no messages yet/i);
    const messageListOrEditLink = page.locator('a[href*="/messages/"]').first();
    await expect(emptyState.or(messageListOrEditLink)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The messages panel is visible for the admin with buckets read.'
    );
  });
});
