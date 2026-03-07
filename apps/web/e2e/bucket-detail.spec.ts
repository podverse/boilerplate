import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';
const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Bucket detail', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-detail-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees bucket detail for seeded bucket', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-detail-by-short-id-expect-bucket-name-and-content',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}`));
    await expect(page.getByText('E2E Bucket One')).toBeVisible();
    await expect(
      page
        .getByRole('link', { name: /settings/i })
        .or(page.getByRole('link', { name: /messages/i }))
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'bucket-detail-page-shows-bucket-name-E2E-Bucket-One-and-settings-or-messages-links'
    );
  });

  test('invalid bucket id shows 404', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-with-invalid-id-expect-not-found',
      async () => {
        await page.goto('/bucket/nonexistent-bucket-id-99999');
      }
    );
    await expect(
      page
        .getByText(/not found|404|does not exist/i)
        .or(page.getByRole('heading', { name: /not found|404/i }))
    ).toBeVisible();
  });
});
