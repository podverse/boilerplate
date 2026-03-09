import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Bucket child new', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/new`,
      'navigate-to-bucket-child-new-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees child bucket create form', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-child-new-route-and-expect-child-bucket-create-form-visible',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create topic|create|save|add bucket/i })
    ).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'bucket-child-new-form-visible-with-name-input-and-submit'
    );
  });

  test('empty submit shows validation and stays on create page', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);

    await actionAndCapture(
      page,
      testInfo,
      'submit-empty-child-topic-form-and-expect-validation',
      async () => {
        await page.getByRole('button', { name: /create topic|create|save|add bucket/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
    await expect(page.getByText(/required|name/i).first()).toBeVisible();
  });

  test('cancel returns to bucket topics view', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);

    await actionAndCapture(
      page,
      testInfo,
      'cancel-child-topic-creation-and-return-to-bucket',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?$`));
  });

  test('valid child topic create redirects back and shows new topic', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
    const topicName = nextFixtureName('e2e-child-topic');
    await page.getByRole('textbox', { name: /name/i }).fill(topicName);

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-child-topic-form-and-return-to-bucket-topics',
      async () => {
        await page.getByRole('button', { name: /create topic|create|save|add bucket/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?$`));
    await expect(page.getByText(new RegExp(topicName, 'i')).first()).toBeVisible();
  });
});
