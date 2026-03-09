import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Users list', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'navigate-to-management-users-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/users');
      }
    );
  });

  test('authenticated user sees users list or add-user CTA', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-expect-list-or-add-user-cta',
      async () => {
        await page.goto('/users');
      }
    );
    await expect(page).toHaveURL(/\/users/);
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add user|new user|create/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-users-page-visible-with-list-or-add-cta');
  });

  test('add user CTA navigates to new user form', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users');
    await actionAndCapture(
      page,
      testInfo,
      'click-add-user-cta-and-expect-navigation-to-management-users-new-route',
      async () => {
        await page
          .getByRole('link', { name: /add user|new user|create/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/users\/new/);
    await expect(page.getByRole('heading', { name: /add user/i })).toBeVisible();
  });

  test('users route supports explicit query params', async ({ page }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-users-with-query-params-and-verify-persistence',
      async () => {
        await page.goto('/users?search=e2e&page=1&sortBy=email&sortOrder=asc');
      }
    );
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/users');
    expect(currentUrl.searchParams.get('search')).toBe('e2e');
    expect(currentUrl.searchParams.get('page')).toBe('1');
    expect(currentUrl.searchParams.get('sortBy')).toBe('email');
    expect(currentUrl.searchParams.get('sortOrder')).toBe('asc');
  });

  test('existing user delete opens confirmation and cancel keeps row', async ({
    page,
  }, testInfo) => {
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users?search=e2e@example.com');
    const row = page.locator('tr', { hasText: 'e2e@example.com' }).first();
    await expect(row).toBeVisible();

    await actionAndCapture(page, testInfo, 'open-user-delete-confirmation-and-cancel', async () => {
      await row.getByRole('button', { name: /delete/i }).click();
      const cancelButton = page
        .locator('button')
        .filter({ hasText: /cancel/i })
        .last();
      await expect(cancelButton).toBeVisible();
      await cancelButton.click();
    });

    await expect(page.locator('tr', { hasText: 'e2e@example.com' })).toHaveCount(1);
  });
});
