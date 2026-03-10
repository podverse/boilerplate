import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_SUPER_ADMIN_ID = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

test.describe('This suite verifies the management admin-detail-page for the limited-admin (admins read) user.', () => {
  test('When a limited-admin (with admins read) opens the admin-detail-page with an invalid admin id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (admins read)');
    await loginAsLimitedAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the management admin-detail-page with an invalid admin id and sees not found.',
      async () => {
        await page.goto('/admin/99999999-9999-4999-a999-999999999999');
      }
    );
  });

  test('When a limited-admin (with admins read) opens the admin-detail-page, they see the admin detail.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (admins read)');
    await loginAsLimitedAdmin(page);
    await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
    await expect(page).toHaveURL(new RegExp(`/admin/${E2E_SUPER_ADMIN_ID}(?:/|$)`));
    await expect(page.getByRole('heading', { name: /view admin/i })).toBeVisible();
    await expect(page.getByText(/username:\s*e2e-superadmin/i)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin sees the admin-detail-page when they have admins read permission.'
    );
  });

  test('When a limited-admin (with admins read) navigates from the admins-list-page to admin-detail via the admin link, the admin detail loads.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (admins read)');
    await loginAsLimitedAdmin(page);
    await page.goto('/admins');
    await expect(page).toHaveURL(/\/admins/);
    const detailLink = page.locator(`a[href="/admin/${E2E_SUPER_ADMIN_ID}"]`).first();
    await expect(detailLink).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the admin link on the admins-list-page and reaches the admin-detail-page.',
      async () => {
        await detailLink.click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/admin/${E2E_SUPER_ADMIN_ID}(?:/|$)`));
    await expect(page.getByRole('heading', { name: /view admin/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admin-detail-page is visible after navigating from the admins-list-page.'
    );
  });
});
