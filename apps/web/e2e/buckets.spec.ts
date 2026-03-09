import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the buckets-list-page.', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
  });

  test('When an unauthenticated user tries to open the buckets-list-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.context().clearCookies();
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/buckets',
      'User navigates to the buckets-list-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When an authenticated user opens the buckets-list-page, they see the list and the add-bucket CTA.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the buckets-list-page after login and sees the list and add-bucket CTA.',
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
      'The buckets-list-page is visible with seed buckets or an empty state and the add-bucket CTA.'
    );
  });

  test('Bucket names from the seed data are visible in the buckets list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await page.goto('/buckets');
    await expect(page.getByText('E2E Bucket One')).toBeVisible();
    await expect(page.getByText('E2E Bucket Two')).toBeVisible();
    const rowCount = await page.getByRole('table').locator('tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(2);
    await capturePageLoad(
      page,
      testInfo,
      'The buckets-list-page shows the seed bucket names E2E Bucket One and E2E Bucket Two.'
    );
  });

  test('When the user clicks the add bucket link, they are taken to the new bucket page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await page.goto('/buckets');
    await expect(page.getByRole('link', { name: /add bucket|new bucket/i }).first()).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the add bucket link and is navigated to the new bucket page.',
      async () => {
        await page
          .getByRole('link', { name: /add bucket|new bucket/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
  });

  test('When the user opens the buckets page with explicit sort and search query params, the route preserves them.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await actionAndCapture(
      page,
      testInfo,
      'User opens the buckets page with explicit sort, search, and page query params.',
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
