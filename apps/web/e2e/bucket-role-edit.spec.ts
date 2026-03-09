import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import {
  clickDeleteAndAcceptBrowserDialog,
  expectInvalidRouteShowsNotFound,
} from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies editing an existing bucket role.', () => {
  test('When an unauthenticated user tries to open the bucket-role-edit-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`,
      'User navigates to the bucket-role-edit-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When the user opens the bucket-role-edit-page with an invalid role id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-role-edit-page with an invalid role id and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-role-edit-page with an invalid role id renders not found.'
    );
  });

  test('When the user edits an existing custom role and saves, the role is updated and they return to the roles list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    const createdName = nextFixtureName('e2e-web-role');
    const updatedName = nextFixtureName('e2e-web-role-updated');

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await page.getByRole('textbox', { name: /role name|name/i }).fill(createdName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByText(new RegExp(createdName, 'i')).first()).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User opens the bucket-role-edit-page for the created custom role.',
      async () => {
        const row = page.locator('li', { hasText: createdName }).first();
        await row.getByRole('link', { name: /edit/i }).click();
      }
    );

    const roleNameInput = page.getByRole('textbox', { name: /role name|name/i });
    await expect(roleNameInput).toBeVisible();
    await roleNameInput.fill(updatedName);

    await actionAndCapture(
      page,
      testInfo,
      'User saves the updated custom role and is returned to the roles list.',
      async () => {
        await page.getByRole('button', { name: /save|create/i }).click();
      }
    );

    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByText(new RegExp(updatedName, 'i')).first()).toBeVisible();
  });

  test('When the user deletes a custom role from the roles list, the role is removed.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    const createdName = nextFixtureName('e2e-web-role-delete');

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await expect(page.getByRole('textbox', { name: /role name|name/i })).toBeVisible();
    await page.getByRole('textbox', { name: /role name|name/i }).fill(createdName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );

    const roleRow = page.locator('li', { hasText: createdName }).first();
    await expect(roleRow).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User deletes the created custom role from the roles list.',
      async () => {
        await clickDeleteAndAcceptBrowserDialog(
          page,
          roleRow.getByRole('button', { name: /delete/i })
        );
      }
    );

    await expect(page.getByText(new RegExp(createdName, 'i')).first()).toHaveCount(0);
  });
});
