import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { clickConfirmDeleteInModal } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Admins list', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-admins-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/admins');
      }
    );
  });

  test('authenticated user sees admins list or add-admin CTA', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admins-expect-list-or-add-admin-cta',
      async () => {
        await page.goto('/admins');
      }
    );
    await expect(page).toHaveURL(/\/admins/);
    await expect(page.getByRole('heading', { name: /admins/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add admin|new admin|create/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-admins-page-visible-with-list-or-add-cta');
  });

  test('add admin CTA navigates to new admin form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins');
    await actionAndCapture(
      page,
      testInfo,
      'click-add-admin-cta-and-expect-navigation-to-management-admins-new-route',
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

  test('superadmin row does not expose delete action', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins?search=e2e-superadmin');

    const superAdminRow = page.locator('tr', { hasText: /e2e-superadmin/i }).first();
    await expect(superAdminRow).toBeVisible();
    await expect(superAdminRow.getByRole('button', { name: /delete/i })).toHaveCount(0);
    await capturePageLoad(
      page,
      testInfo,
      'management-admins-superadmin-row-visible-without-delete-action'
    );
  });

  test('created admin can be deleted from admins list', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/admins/new');

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
      'delete-created-admin-row-from-management-admins-table',
      async () => {
        await row.getByRole('button', { name: /delete/i }).click();
        await clickConfirmDeleteInModal(page);
      }
    );

    await page.goto(`/admins?search=${encodeURIComponent(username)}`);
    await expect(page.locator('tr', { hasText: username })).toHaveCount(0);
  });
});
