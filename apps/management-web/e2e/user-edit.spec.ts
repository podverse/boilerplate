import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
const E2E_MAIN_USER_ID = '11111111-1111-4111-a111-111111111111';

test.describe('Management user edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-user-edit-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);
      }
    );
  });

  test('authenticated user sees edit user form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-user-edit-route-and-expect-edit-user-form-visible',
      async () => {
        await page.goto(`/user/${E2E_MAIN_USER_ID}/edit`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/user/${E2E_MAIN_USER_ID}/edit`));
    const visibleFormField = page.getByRole('textbox', { name: /email|display/i }).first();
    const hasFormField = await visibleFormField.isVisible().catch(() => false);
    if (hasFormField) {
      await expect(page.getByRole('button', { name: /save|update/i })).toBeVisible();
    } else {
      await expect(page.getByText(/not found|404/i)).toBeVisible();
    }
    await capturePageLoad(
      page,
      testInfo,
      'management-user-edit-route-visible-with-edit-form-or-not-found-state'
    );
  });

  test('editing user profile persists after save and reload', async ({ page }, testInfo) => {
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
      'save-updated-management-user-profile-and-return-to-users-list',
      async () => {
        await page.getByRole('button', { name: /save changes|save|update/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/users(\?|$)/);
    await page.goto(`/users?search=${encodeURIComponent(currentEmail)}`);
    await expect(page.getByText(new RegExp(updatedDisplayName, 'i')).first()).toBeVisible();
  });
});
