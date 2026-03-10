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

/**
 * Permission: canReadAdmins (adminsCrud read) required; else redirect /admins. Actor matrix:
 * unauthenticated → login; super-admin and limited-admin (has admins read) → see detail; admin
 * without admins read (e.g. admin-with-bucket-admins) → redirect /admins.
 */

test.describe('This suite verifies the management admin-detail-page: unauthenticated redirect, invalid id→not found, permitted role sees detail and edit link, list→detail flow.', () => {
  test('When an unauthenticated user tries to open the admin-detail-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management admin-detail-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
      }
    );
  });

  test('When the super-admin opens the admin-detail-page with an invalid admin id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the management admin-detail-page with an invalid admin id and sees not found.',
      async () => {
        await page.goto('/admin/99999999-9999-4999-a999-999999999999');
      }
    );
  });

  test('When a permitted user (super-admin) opens the admin-detail-page, they see the admin detail and the edit link.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management admin-detail-route and sees the admin detail and edit link.',
      async () => {
        await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
        await expect(page).toHaveURL(new RegExp(`/admin/${E2E_SUPER_ADMIN_ID}(?:/|$)`));
        await expect(page.getByRole('heading', { name: /view admin/i })).toBeVisible();
        await expect(page.getByText(/username:\s*e2e-superadmin/i)).toBeVisible();
        await expect(page.locator(`a[href*="/admin/${E2E_SUPER_ADMIN_ID}/edit"]`)).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The management admin-detail-page is visible with the seeded-super-admin data and edit link.'
    );
  });

  test('When the super-admin navigates from the admins-list-page to the admin-detail-page via the admin link, the admin detail loads.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
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

  test('When an admin without adminsCrud (e.g. admin-with-bucket-admins) opens the admin-detail-page, they are redirected to the admins list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no admins CRUD');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/admin/${E2E_SUPER_ADMIN_ID}`);
    await expect(page).toHaveURL(/\/admins/);
    await capturePageLoad(
      page,
      testInfo,
      'The admin without adminsCrud is redirected to the admins list when opening the admin-detail-page.'
    );
  });
});
