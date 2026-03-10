import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { clickConfirmDeleteInModal } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/**
 * Permission: bucketsCrud read required; else redirect dashboard. Actor matrix: unauthenticated →
 * login; super-admin and admin with buckets read → see list; limited-admin (no buckets read) →
 * redirect dashboard.
 */

test.describe('This suite verifies the management buckets-list page: unauthenticated redirect, permitted role sees list or add-bucket CTA, add-bucket CTA→new form, URL state (search, page, sortBy, sortOrder) with visible content, and delete flow.', () => {
  test('When an unauthenticated user tries to open the buckets-list page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management buckets-list page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/buckets');
      }
    );
  });

  test('When a permitted user (super-admin) opens the buckets-list page, they see the buckets heading and the add-bucket link.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management buckets-list page and sees the list or add-bucket CTA.',
      async () => {
        await page.goto('/buckets');
      }
    );
    await expect(page).toHaveURL(/\/buckets/);
    await expect(page.getByRole('heading', { name: /buckets/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add bucket|new bucket|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The buckets-list page is visible with heading and add-bucket link.'
    );
  });

  test('When the user clicks the add-bucket link, they are navigated to the buckets-new page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets');
    await expect(page.getByRole('heading', { name: /buckets/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the add-bucket link and is navigated to the buckets-new page.',
      async () => {
        await page
          .getByRole('link', { name: /add bucket|new bucket|create/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByRole('heading', { name: /add bucket/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The buckets-new page is visible after clicking the add-bucket link.'
    );
  });

  test('When the user opens the buckets-list with query params, the params persist in the URL and the page shows the buckets list or empty state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the buckets-list with search, page, sortBy, and sortOrder; params persist and table or empty state is visible.',
      async () => {
        await page.goto('/buckets?search=e2e&page=1&sortBy=name&sortOrder=asc');
      }
    );
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/buckets');
    expect(currentUrl.searchParams.get('search')).toBe('e2e');
    expect(currentUrl.searchParams.get('page')).toBe('1');
    expect(currentUrl.searchParams.get('sortBy')).toBe('name');
    expect(currentUrl.searchParams.get('sortOrder')).toBe('asc');
    await expect(page.getByRole('heading', { name: /buckets/i })).toBeVisible();
    const tableOrEmpty = page.getByRole('table').or(page.getByText(/no buckets|no buckets yet/i));
    await expect(tableOrEmpty).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The buckets-list shows URL state and visible table or empty content.'
    );
  });

  test('When the user deletes a bucket from the buckets-list, the bucket is removed from the list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();

    const bucketName = nextFixtureName('e2e-mgmt-bucket-delete');
    await page.getByRole('textbox', { name: /name|bucket/i }).fill(bucketName);
    const ownerSelect = page.getByLabel(/owner/i);
    if ((await ownerSelect.count()) > 0) {
      await ownerSelect.selectOption({ index: 1 });
    }

    await page.getByRole('button', { name: /create bucket|add bucket|create|save/i }).click();
    await expect(page).toHaveURL(/\/bucket\/|\/buckets$/);

    await page.goto(`/buckets?search=${encodeURIComponent(bucketName)}`);
    const row = page.locator('tr', { hasText: bucketName }).first();
    await expect(row).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User deletes the created bucket from the buckets-list and confirms in the modal.',
      async () => {
        await row.getByRole('button', { name: /delete/i }).click();
        await clickConfirmDeleteInModal(page);
      }
    );

    await page.goto(`/buckets?search=${encodeURIComponent(bucketName)}`);
    await expect(page).toHaveURL(/\/buckets\?search=/);
    await expect(page.locator('tr', { hasText: bucketName })).toHaveCount(0);
    await capturePageLoad(page, testInfo, 'The buckets-list no longer shows the deleted bucket.');
  });

  test('When a limited-admin (no buckets permission) opens the buckets-list route, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets permission)');
    await loginAsLimitedAdmin(page);
    await page.goto('/buckets');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when visiting the buckets route.'
    );
  });

  test('When an admin with buckets read opens the buckets-list page, they see the buckets heading and list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto('/buckets');
    await expect(page).toHaveURL(/\/buckets/);
    await expect(page.getByRole('heading', { name: /buckets/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admin with buckets read sees the buckets-list page.'
    );
  });
});
