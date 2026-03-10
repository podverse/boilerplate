import { expect, test } from '@playwright/test';

import { loginAsWebE2EAdminWithPermission } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { capturePageLoad } from './helpers/stepScreenshots';
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

  test('When the non-owner admin with bucket roles permission opens the roles-list, edit links are not shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=roles`);
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.locator('a[href*="/settings/roles/"][href*="/edit"]')).toHaveCount(0);
    await expect(page.getByText(/no custom roles yet/i)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The roles-list is visible and edit links are not shown for the seeded-bucket-admin.'
    );
  });

  test('When the non-owner admin with bucket roles permission opens the roles-list, the create role link is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings?tab=roles`);
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByRole('link', { name: /create role/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'The roles-list is visible with create-role link.');
  });
});
