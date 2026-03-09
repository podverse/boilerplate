import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Bucket nested new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`,
      'navigate-to-bucket-nested-new-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees nested bucket create form', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-nested-new-route-and-expect-nested-create-form-visible',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`));
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create topic|create|save|add bucket/i })
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'bucket-nested-new-form-visible-with-name-input-and-submit'
    );
  });

  test('empty submit shows validation and stays on create page', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`);

    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-nested-topic-form-and-expect-validation',
      async () => {
        await page.getByRole('button', { name: /create topic|create|save|add bucket/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`));
    await expect(page.getByText(/required|name/i).first()).toBeVisible();
  });

  test('cancel returns to bucket detail', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`);

    await actionAndCapture(
      page,
      testInfo,
      'cancel-nested-topic-creation-and-return-to-bucket',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}$`));
  });

  test('valid nested topic create redirects back to bucket detail', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`);
    await page.getByRole('textbox', { name: /name/i }).fill(`e2e-nested-topic-${Date.now()}`);

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-nested-topic-form-and-return-to-bucket',
      async () => {
        await page.getByRole('button', { name: /create topic|create|save|add bucket/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}$`));
  });
});
