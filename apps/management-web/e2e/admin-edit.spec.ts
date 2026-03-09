import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

test.describe('This suite covers Editing a management admin.', () => {
  test('When an unauthenticated user tries to open the admin-edit-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admin-edit-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);
      }
    );
  });

  test('When an authenticated user opens the admin-edit-page, they see the edit admin form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admin-edit-route and sees the edit admin form.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/admin/${E2E_SUPER_ADMIN_ID}/edit`));
    await expect(page.getByRole('textbox', { name: /display name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /^username$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save|update/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management admin-edit-form is visible with fields and save button.'
    );
  });

  test('When the user edits the admin profile and saves, the changes persist after reload.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);

    const displayNameInput = page.getByRole('textbox', { name: /display name/i });
    await expect(displayNameInput).toBeVisible();
    const updatedDisplayName = `E2E Superadmin ${Date.now()}`;
    await displayNameInput.fill(updatedDisplayName);

    await actionAndCapture(
      page,
      testInfo,
      'User saves the updated management admin display name and is returned to the admins list.',
      async () => {
        await page.getByRole('button', { name: /save changes|save|update/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/admins(\?|$)/);
    await page.goto('/admins?search=e2e-superadmin');
    await expect(page.getByText(new RegExp(updatedDisplayName, 'i')).first()).toBeVisible();
  });
});
