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

test.describe('Buckets list', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/buckets');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees buckets list or add-bucket CTA', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-management-buckets-expect-list-or-add-bucket-cta',
      async () => {
        await page.goto('/buckets');
      }
    );
    await expect(page).toHaveURL(/\/buckets/);
    await expect(
      page
        .getByRole('link', { name: /add bucket|new bucket|create/i })
        .or(page.getByRole('heading', { name: /buckets/i }))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'management-buckets-page-visible-with-list-or-add-cta');
  });
});
