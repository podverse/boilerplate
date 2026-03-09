import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { clickConfirmDeleteInModal } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Management buckets-list-page.', () => {
  test('When an unauthenticated user tries to open the buckets-list-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management buckets page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/buckets');
      }
    );
  });

  test('When an authenticated user opens the buckets-list-page, they see the buckets list or add-bucket CTA.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management buckets page and sees the list or add-bucket CTA.',
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
      'The management buckets page is visible with list or add-bucket CTA.'
    );
  });

  test('When the user clicks the add bucket CTA, they are navigated to the new bucket form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets');
    await expect(page.getByRole('heading', { name: /buckets/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the add bucket CTA and is navigated to the management buckets new route.',
      async () => {
        await page
          .getByRole('link', { name: /add bucket|new bucket|create/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByRole('heading', { name: /add bucket/i })).toBeVisible();
  });

  test('When the user opens the buckets route with explicit query params, the params are persisted.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management buckets page with query params and they persist.',
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
  });

  test('When the user deletes a created bucket from the buckets list, the bucket is removed.', async ({
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
      'User deletes the created bucket row from the management buckets table.',
      async () => {
        await row.getByRole('button', { name: /delete/i }).click();
        await clickConfirmDeleteInModal(page);
      }
    );

    await page.goto(`/buckets?search=${encodeURIComponent(bucketName)}`);
    await expect(page).toHaveURL(/\/buckets\?search=/);
    await expect(page.locator('tr', { hasText: bucketName })).toHaveCount(0);
  });
});
