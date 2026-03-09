import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Buckets list', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
  });

  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await page.context().clearCookies();
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/buckets',
      'navigate-to-buckets-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees buckets list and add-bucket CTA', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-buckets-page-after-login-expect-list-and-add-cta',
      async () => {
        await page.goto('/buckets');
      }
    );
    await expect(page).toHaveURL(/\/buckets/);
    await expect(page.getByRole('link', { name: /add bucket|new bucket/i })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'buckets-list-visible-with-seed-buckets-or-empty-state-and-add-bucket-cta'
    );
  });

  test('bucket names from seed are visible', async ({ page }, testInfo) => {
    await page.goto('/buckets');
    await expect(page.getByText('E2E Bucket One')).toBeVisible();
    await expect(page.getByText('E2E Bucket Two')).toBeVisible();
    const rowCount = await page.getByRole('table').locator('tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(2);
    await capturePageLoad(
      page,
      testInfo,
      'buckets-list-shows-seed-bucket-names-E2E-Bucket-One-or-Two'
    );
  });

  test('add bucket link goes to new bucket page', async ({ page }, testInfo) => {
    await page.goto('/buckets');
    await actionAndCapture(
      page,
      testInfo,
      'click-add-bucket-link-and-verify-navigation-to-buckets-new',
      async () => {
        await page
          .getByRole('link', { name: /add bucket|new bucket/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
  });

  test('buckets route preserves explicit sort and search query params', async ({
    page,
  }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'open-buckets-with-explicit-sort-search-page-query-params',
      async () => {
        await page.goto('/buckets?search=e2e&sortBy=name&sortOrder=asc&page=1');
      }
    );

    await expect(page).toHaveURL(/\/buckets\?/);
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/buckets');
    expect(currentUrl.searchParams.get('search')).toBe('e2e');
    expect(currentUrl.searchParams.get('sortBy')).toBe('name');
    expect(currentUrl.searchParams.get('sortOrder')).toBe('asc');
    expect(currentUrl.searchParams.get('page')).toBe('1');
  });
});
