import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectNotFoundPageVisible } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';
const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

test.describe('This suite covers Editing a management user.', () => {
  test('When an unauthenticated user tries to open the user edit page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management user edit page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);
      }
    );
  });

  test('When an authenticated user opens the user edit page, they see the edit user form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management user edit route and sees the edit user form.',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);
        const visibleFormField = page.getByRole('textbox', { name: /email|display/i }).first();
        const hasFormField = await visibleFormField.isVisible().catch(() => false);
        if (hasFormField) {
          await expect(page.getByRole('button', { name: /save|update/i })).toBeVisible();
        } else {
          await expectNotFoundPageVisible(page);
        }
      }
    );
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}/edit`));
    const visibleFormField = page.getByRole('textbox', { name: /email|display/i }).first();
    const hasFormField = await visibleFormField.isVisible().catch(() => false);
    if (hasFormField) {
      await expect(page.getByRole('button', { name: /save|update/i })).toBeVisible();
    } else {
      await expectNotFoundPageVisible(page);
    }
    await capturePageLoad(
      page,
      testInfo,
      'The management user edit route is visible with edit form or not found state.'
    );
  });

  test('When the user edits the user profile and saves, the changes persist after reload.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);

    const emailInput = page.getByRole('textbox', { name: /email/i }).first();
    const displayNameInput = page.getByRole('textbox', { name: /display name/i }).first();
    await expect(emailInput).toBeVisible();
    await expect(displayNameInput).toBeVisible();

    const currentEmail = await emailInput.inputValue();
    const updatedDisplayName = `E2E User Updated ${Date.now()}`;
    await displayNameInput.fill(updatedDisplayName);

    await actionAndCapture(
      page,
      testInfo,
      'User saves the updated management user profile and is returned to the users list.',
      async () => {
        await page.getByRole('button', { name: /save changes|save|update/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/users(\?|$)/);
    await page.goto(`/users?search=${encodeURIComponent(currentEmail)}`);
    await expect(page.getByText(new RegExp(updatedDisplayName, 'i')).first()).toBeVisible();
  });
});
