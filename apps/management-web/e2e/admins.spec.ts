import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { clickConfirmDeleteInModal } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Management admins-list-page.', () => {
  test('When an unauthenticated user tries to open the admins-list-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admins page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/admins');
      }
    );
  });

  test('When an authenticated user opens the admins-list-page, they see the admins list or add-admin CTA.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admins page and sees the list or add-admin CTA.',
      async () => {
        await page.goto('/admins');
      }
    );
    await expect(page).toHaveURL(/\/admins/);
    await expect(page.getByRole('heading', { name: /admins/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add admin|new admin|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management admins page is visible with list or add-admin CTA.'
    );
  });

  test('When the user clicks the add admin CTA, they are navigated to the new admin form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins');
    await expect(page.getByRole('heading', { name: /admins/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the add admin CTA and is navigated to the management admins new route.',
      async () => {
        await page
          .getByRole('link', { name: /add admin|new admin|create/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/admins\/new/);
    await expect(page.getByRole('heading', { name: /add admin/i })).toBeVisible();
  });

  test('When the user views the superadmin row, no delete action is exposed.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins?search=e2e-superadmin');

    const superAdminRow = page.locator('tr', { hasText: /e2e-superadmin/i }).first();
    await expect(superAdminRow).toBeVisible();
    await expect(superAdminRow.getByRole('button', { name: /delete/i })).toHaveCount(0);
    await capturePageLoad(
      page,
      testInfo,
      'The management admins superadmin row is visible without a delete action.'
    );
  });

  test('When the user deletes a created admin from the admins list, the admin is removed.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins/new');
    await expect(page.getByRole('textbox', { name: /display name/i })).toBeVisible();

    const username = nextFixtureName('e2e-admin-delete');
    const displayName = `E2E ${username}`;
    await page.getByRole('textbox', { name: /display name/i }).fill(displayName);
    await page.getByRole('textbox', { name: /^username$/i }).fill(username);
    await page.getByLabel(/^password/i).fill('Test!1Aa');

    await page.getByRole('button', { name: /add admin|create|save/i }).click();
    await expect(page).toHaveURL(/\/admins(\?|$)/);

    await page.goto(`/admins?search=${encodeURIComponent(username)}`);
    const row = page.locator('tr', { hasText: username }).first();
    await expect(row).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User deletes the created admin row from the management admins table.',
      async () => {
        await row.getByRole('button', { name: /delete/i }).click();
        await clickConfirmDeleteInModal(page);
      }
    );

    await page.goto(`/admins?search=${encodeURIComponent(username)}`);
    await expect(page).toHaveURL(/\/admins\?search=/);
    await expect(page.locator('tr', { hasText: username })).toHaveCount(0);
  });
});
