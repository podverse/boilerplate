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

test.describe('Admins list', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admins-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/admins');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees admins list or add-admin CTA', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-admins-expect-list-or-add-admin-cta',
      async () => {
        await page.goto('/admins');
      }
    );
    await expect(page).toHaveURL(/\/admins/);
    await expect(page.getByRole('heading', { name: /admins/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add admin|new admin|create/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-admins-page-visible-with-list-or-add-cta');
  });

  test('add admin CTA navigates to new admin form', async ({ page }, testInfo) => {
    await login(page);
    await page.goto('/admins');
    await actionAndCapture(
      page,
      testInfo,
      'click-add-admin-cta-and-expect-navigation-to-management-admins-new-route',
      async () => {
        await page
          .getByRole('link', { name: /add admin|new admin|create/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/admins\/new/);
    await expect(page.getByRole('heading', { name: /add admin/i })).toBeVisible();
  });
});
