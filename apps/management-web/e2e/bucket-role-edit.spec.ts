import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture } from './helpers/stepScreenshots';
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

test.describe('Management bucket role edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-bucket-role-edit-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
  });

  test('invalid role id shows not found', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-management-bucket-role-edit-with-invalid-role-id-and-expect-not-found',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/invalid-role-99999/edit`);
      }
    );
  });

  test('existing custom role can be edited and saved', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    const createdName = nextFixtureName('e2e-mgmt-role');
    const updatedName = nextFixtureName('e2e-mgmt-role-updated');

    await page.goto(`/bucket/${E2E_BUCKET1_ID}/settings/roles/new`);
    await page.getByRole('textbox', { name: /role name|name/i }).fill(createdName);
    await page.getByRole('button', { name: /save|create/i }).click();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
    await expect(page.getByText(new RegExp(createdName, 'i')).first()).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'open-management-edit-page-for-created-custom-role',
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
      'save-updated-management-custom-role-and-return-to-roles-list',
      async () => {
        await page.getByRole('button', { name: /save|create/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/settings\\?tab=roles`));
    await expect(page.getByText(new RegExp(updatedName, 'i')).first()).toBeVisible();
  });
});
