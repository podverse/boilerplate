import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin, nextFixtureName } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { clickConfirmDeleteInModal } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Buckets list', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-buckets-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/buckets');
      }
    );
  });

  test('authenticated user sees buckets list or add-bucket CTA', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-expect-list-or-add-bucket-cta',
      async () => {
        await page.goto('/buckets');
      }
    );
    await expect(page).toHaveURL(/\/buckets/);
    await expect(page.getByRole('heading', { name: /buckets/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add bucket|new bucket|create/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-buckets-page-visible-with-list-or-add-cta');
  });

  test('add bucket CTA navigates to new bucket form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets');
    await actionAndCapture(
      page,
      testInfo,
      'click-add-bucket-cta-and-expect-navigation-to-management-buckets-new-route',
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

  test('buckets route supports explicit query params', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-with-query-params-and-verify-persistence',
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

  test('created bucket can be deleted from buckets list', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/buckets/new');

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
      'delete-created-bucket-row-from-management-buckets-table',
      async () => {
        await row.getByRole('button', { name: /delete/i }).click();
        await clickConfirmDeleteInModal(page);
      }
    );

    await page.goto(`/buckets?search=${encodeURIComponent(bucketName)}`);
    await expect(page.locator('tr', { hasText: bucketName })).toHaveCount(0);
  });
});
