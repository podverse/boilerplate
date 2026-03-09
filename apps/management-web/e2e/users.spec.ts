import { expect, test } from '@playwright/test';

import { loginAsManagementSuperAdmin } from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite covers Management users-list-page.', () => {
  test('When an unauthenticated user tries to open the users-list-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management users page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto('/users');
      }
    );
  });

  test('When an authenticated user opens the users-list-page, they see the users list or add-user CTA.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management users page and sees the list or add-user CTA.',
      async () => {
        await page.goto('/users');
      }
    );
    await expect(page).toHaveURL(/\/users/);
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add user|new user|create/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The management users page is visible with list or add-user CTA.'
    );
  });

  test('When the user clicks the add user CTA, they are navigated to the new user form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users');
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the add user CTA and is navigated to the management users new route.',
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

  test('When the user opens the users route with explicit query params, the params are persisted.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management users page with query params and they persist.',
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

  test('When the user opens the delete confirmation for an existing user and cancels, the row remains.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto('/users?search=e2e@example.com');
    const row = page.locator('tr', { hasText: 'e2e@example.com' }).first();
    await expect(row).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User opens the user delete confirmation and clicks cancel.',
      async () => {
        await row.getByRole('button', { name: /delete/i }).click();
        const cancelButton = page
          .locator('button')
          .filter({ hasText: /cancel/i })
          .last();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();
      }
    );

    await expect(page.locator('tr', { hasText: 'e2e@example.com' })).toHaveCount(1);
  });
});
