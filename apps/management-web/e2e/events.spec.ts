import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_USERNAME = 'e2e-superadmin';
const E2E_PASSWORD = 'Test!1Aa';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /username|email/i }).fill(E2E_USERNAME);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Events', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-events-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/events');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees events page', async ({ page }, testInfo) => {
    await login(page);
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
    await login(page);
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
