import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies creating a new child bucket under an existing bucket.', () => {
  test('When an unauthenticated user tries to open the page to create a new child bucket, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/new`,
      'User navigates to the child-bucket-create-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When an authenticated user opens the page to create a new child bucket, they see the create form with a name field and a submit button.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the child-bucket-create-route and the child-bucket-create-form page loads.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The child-bucket-create-form is visible with the name input and the add-bucket submit button.'
    );
  });

  test('When the user submits the child bucket form without entering a name, validation is shown and they remain on the create page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the child-bucket form without filling in the name field and sees validation.',
      async () => {
        await page.getByRole('button', { name: /add bucket|create|save/i }).click();
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
        await expect(page.getByText(/required|name/i).first()).toBeVisible();
      }
    );
  });

  test('When the user clicks cancel on the child-bucket-create-form, they are taken back to the bucket-detail-page (buckets-tab).', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks cancel on the child-bucket-create-form and returns to the bucket-detail-page.',
      async () => {
        await page.getByRole('button', { name: /cancel/i }).click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?$`));
  });

  test('When the user fills in a name and submits the child-bucket form, they are redirected back to the bucket-detail-page and the new bucket is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    const bucketName = nextFixtureName('e2e-child-bucket');
    await page.getByRole('textbox', { name: /name/i }).fill(bucketName);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the child-bucket form with a valid name and is redirected back to the bucket-detail-page.',
      async () => {
        await page.getByRole('button', { name: /add bucket|create|save/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?$`));
    await expect(page.getByText(new RegExp(bucketName, 'i')).first()).toBeVisible();
  });
});
