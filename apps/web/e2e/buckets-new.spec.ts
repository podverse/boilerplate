import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Buckets new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/buckets/new',
      'navigate-to-buckets-new-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees create bucket form', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
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
    await loginAsWebE2EUserAndExpectDashboard(page);
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
    await loginAsWebE2EUserAndExpectDashboard(page);
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

  test('submitting valid form creates bucket and returns to bucket surfaces', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/buckets/new');

    const bucketName = nextFixtureName('e2e-web-bucket');
    await page.getByRole('textbox', { name: /name|bucket name/i }).fill(bucketName);

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-create-bucket-form-and-expect-redirect',
      async () => {
        await page.getByRole('button', { name: /create|save|add bucket/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/buckets|\/bucket\//);
    await expect(page.getByText(new RegExp(bucketName, 'i')).first()).toBeVisible();
  });
});
