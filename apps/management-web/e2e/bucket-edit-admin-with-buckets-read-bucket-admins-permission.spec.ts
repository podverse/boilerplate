import { expect, test } from '@playwright/test';

import { loginAsManagementAdminWithBucketAdmins } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('This suite verifies the management bucket-edit-page for the admin with buckets read (bucket-admins permission) user.', () => {
  test('When an admin with buckets read opens the bucket-edit-page with an invalid bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-edit-page with an invalid bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/99999999-9999-4999-a999-999999999999/edit');
      }
    );
  });

  test('When an admin with buckets read opens the bucket-edit-page, they are redirected to bucket-settings and see the edit form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/edit`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings`));
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The permitted admin sees the bucket-edit form after redirect from bucket-edit.'
    );
  });

  test('When an admin with buckets read navigates from buckets-list to bucket-edit, they are redirected to bucket-settings.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/buckets');
    await expect(page).toHaveURL(/\/buckets/);
    const editLink = page.locator(`a[href*="/bucket/${E2E_BUCKET1_ID}/edit"]`).first();
    await expect(editLink).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks edit on buckets-list and is taken to bucket-settings.',
      async () => {
        await editLink.click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings`));
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'The bucket-settings page is visible after list→edit.');
  });

  test('When an admin with buckets read clicks Cancel on bucket-edit, they return to the bucket-view page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/edit`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings`));
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks Cancel and returns to bucket-view page.',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}(?:/|$)`));
    await capturePageLoad(page, testInfo, 'The bucket-view page is visible after Cancel.');
  });
});
