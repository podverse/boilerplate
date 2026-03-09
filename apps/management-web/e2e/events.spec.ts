import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Management events-page.', () => {
  test('When an unauthenticated user tries to open the events-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management events-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/events');
      }
    );
  });

  test('When an authenticated user opens the events-page, they see the events-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management events-page and sees the list or heading.',
      async () => {
        await page.goto('/events');
      }
    );
    await expect(page).toHaveURL(/\/events/);
    await expect(page.getByRole('heading', { name: /events/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'The management events-page is visible.');
  });

  test('When the user opens the events route with sort and search query params, the page loads with those params.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management events-page with sort and search query params and the page loads.',
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
