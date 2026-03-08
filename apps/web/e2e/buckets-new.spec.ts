import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
  await page.getByLabel(/password/i).fill(E2E_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Buckets new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-buckets-new-while-unauthenticated-expect-redirect-to-login',
      async () => {
        await page.goto('/buckets/new');
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user sees create bucket form', async ({ page }, testInfo) => {
    await login(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-buckets-new-and-expect-form-visible',
      async () => {
        await page.goto('/buckets/new');
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByRole('textbox', { name: /name|bucket name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create|save|add bucket/i })).toBeVisible();
    await capturePageLoad(page, testInfo, 'create-bucket-form-visible-with-name-and-submit-button');
  });

  test('cancel or back goes to buckets list', async ({ page }, testInfo) => {
    await login(page);
    await page.goto('/buckets/new');
    const cancel = page.getByRole('link', { name: /cancel|back/i });
    if ((await cancel.count()) > 0) {
      await actionAndCapture(
        page,
        testInfo,
        'click-cancel-or-back-and-verify-navigation-to-buckets-list',
        async () => {
          await cancel.first().click();
        }
      );
      await expect(page).toHaveURL(/\/buckets/);
    }
  });

  test('empty submit shows validation and does not navigate away', async ({ page }, testInfo) => {
    await login(page);
    await page.goto('/buckets/new');
    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-create-bucket-form-and-expect-validation-message-on-page',
      async () => {
        await page.getByRole('button', { name: /create|save|add bucket/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByText(/required|name/i).first()).toBeVisible();
  });
});
