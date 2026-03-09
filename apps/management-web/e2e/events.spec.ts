import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Events', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-events-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/events');
      }
    );
  });

  test('authenticated user sees events page', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-events-expect-list-or-heading',
      async () => {
        await page.goto('/events');
      }
    );
    await expect(page).toHaveURL(/\/events/);
    await expect(page.getByRole('heading', { name: /events/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-events-page-visible');
  });

  test('events route supports query params for sort and search', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-events-with-sort-and-search-query-and-expect-page-load',
      async () => {
        await page.goto('/events?sort=oldest&search=e2e&page=1');
      }
    );
    await expect(page).toHaveURL(/\/events\?/);
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/events');
    expect(currentUrl.searchParams.get('search')).toBe('e2e');
    const pageParam = currentUrl.searchParams.get('page');
    if (pageParam !== null) {
      expect(pageParam).toBe('1');
    }
    const sort = currentUrl.searchParams.get('sort');
    const sortBy = currentUrl.searchParams.get('sortBy');
    const sortOrder = currentUrl.searchParams.get('sortOrder');
    if (sortBy === null && sortOrder === null) {
      expect(sort).toBe('oldest');
    } else {
      expect(sortBy).toBe('timestamp');
      expect(sortOrder).toBe('desc');
      if (sort !== null) {
        expect(sort).toBe('oldest');
      }
    }
    await expect(page.getByRole('heading', { name: /events/i })).toBeVisible();
  });
});
