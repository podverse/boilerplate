import { expect, test } from '@playwright/test';

import { loginAsWebE2EAdminWithPermission } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies the bucket-role-edit-page for the seeded-bucket-admin user.', () => {
  test('When the non-owner admin with bucket roles permission opens the bucket-role-edit-page for an invalid role id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-edit-page with an invalid role id and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
  });

  test('When the non-owner admin with bucket roles permission navigates from the roles-list to edit a role, the bucket-role-edit-form is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=roles`);
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    const editLink = page.locator('a[href*="/settings/roles/"][href*="/edit"]').first();
    await expect(editLink).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the edit link for a role and reaches the bucket-role-edit-page.',
      async () => {
        await editLink.click();
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/[^/]+/edit`)
    );
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-role-edit-form is visible for the seeded-bucket-admin.'
    );
  });

  test('When the non-owner admin with bucket roles permission clicks Cancel on the bucket-role-edit-page, they return to the roles-list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=roles`);
    const editLink = page.locator('a[href*="/settings/roles/"][href*="/edit"]').first();
    await expect(editLink).toBeVisible();
    await editLink.click();
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/[^/]+/edit`)
    );
    await expect(page.getByRole('link', { name: /cancel/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks Cancel on the bucket-role-edit-page and returns to the roles-list.',
      async () => {
        await page.getByRole('link', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await capturePageLoad(page, testInfo, 'The roles-list is visible after Cancel.');
  });
});
