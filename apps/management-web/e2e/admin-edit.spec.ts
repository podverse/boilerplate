import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

test.describe('Management admin edit', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-admin-edit-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);
      }
    );
  });

  test('authenticated user sees edit admin form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admin-edit-route-and-expect-edit-admin-form-visible',
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
      'management-admin-edit-form-visible-with-fields-and-save'
    );
  });

  test('editing admin profile persists after save and reload', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}/edit`);

    const displayNameInput = page.getByRole('textbox', { name: /display name/i });
    await expect(displayNameInput).toBeVisible();
    const updatedDisplayName = `E2E Superadmin ${Date.now()}`;
    await displayNameInput.fill(updatedDisplayName);

    await actionAndCapture(
      page,
      testInfo,
      'save-updated-management-admin-display-name-and-return-to-admins-list',
      async () => {
        await page.getByRole('button', { name: /save changes|save|update/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/admins(\?|$)/);
    await page.goto('/admins?search=e2e-superadmin');
    await expect(page.getByText(new RegExp(updatedDisplayName, 'i')).first()).toBeVisible();
  });
});
