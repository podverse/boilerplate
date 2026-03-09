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
const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Bucket role edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`,
      'navigate-to-bucket-role-edit-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('invalid role id shows not found', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-bucket-role-edit-with-invalid-role-id-and-expect-not-found',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
    await capturePageLoad(page, testInfo, 'bucket-role-edit-invalid-role-id-renders-not-found');
  });

  test('existing custom role can be edited and saved', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    const createdName = nextFixtureName('e2e-web-role');
    const updatedName = nextFixtureName('e2e-web-role-updated');

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
    await page.getByRole('textbox', { name: /role name|name/i }).fill(createdName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByText(new RegExp(createdName, 'i')).first()).toBeVisible();

    await actionAndCapture(page, testInfo, 'open-edit-page-for-created-custom-role', async () => {
      const row = page.locator('li', { hasText: createdName }).first();
      await row.getByRole('link', { name: /edit/i }).click();
    });

    const roleNameInput = page.getByRole('textbox', { name: /role name|name/i });
    await expect(roleNameInput).toBeVisible();
    await roleNameInput.fill(updatedName);

    await actionAndCapture(
      page,
      testInfo,
      'save-updated-custom-role-and-return-to-roles-list',
      async () => {
        await page.getByRole('button', { name: /save|create/i }).click();
      }
    );

    await expect(page).toHaveURL(
      new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings\\?tab=roles`)
    );
    await expect(page.getByText(new RegExp(updatedName, 'i')).first()).toBeVisible();
  });

  test('custom role can be deleted from roles list', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    const createdName = nextFixtureName('e2e-web-role-delete');

    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/settings/roles/new`);
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
      'delete-created-custom-role-from-roles-list',
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
