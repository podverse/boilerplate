import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';

test.describe('Buckets list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
    await page.getByLabel(/password/i).fill(E2E_PASSWORD);
    await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await page.context().clearCookies();
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-buckets-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/buckets');
      }
    );
    await expect(page).toHaveURL(/\/login/);
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
});
