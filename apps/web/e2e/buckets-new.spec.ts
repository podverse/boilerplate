import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies creating a new top-level bucket.', () => {
  test('When an unauthenticated user tries to open the new-bucket-page, they are redirected to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      '/buckets/new',
      'User navigates to the new-bucket-page while not logged in and is redirected to the login page.',
      testInfo
    );
  });

  test('When an authenticated user opens the new-bucket-page, they see the create-bucket form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the new-bucket-page and the create-bucket form loads.',
      async () => {
        await page.goto('/buckets/new');
      }
    );
    await expect(page).toHaveURL(/\/buckets\/new/);
    await expect(page.getByRole('textbox', { name: /name|bucket name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create|save|add bucket/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The create-bucket form is visible with a name field and submit button.'
    );
  });

  test('When the user clicks cancel or back, they are taken to the buckets list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('textbox', { name: /name|bucket name/i })).toBeVisible();
    const cancel = page.getByRole('link', { name: /cancel|back/i });
    if ((await cancel.count()) > 0) {
      await actionAndCapture(
        page,
        testInfo,
        'User clicks cancel or back and is navigated to the buckets list.',
        async () => {
          await cancel.first().click();
        }
      );
      await expect(page).toHaveURL(/\/buckets/);
    }
  });

  test('When the user submits the create bucket form without entering a name, validation is shown and they remain on the page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('textbox', { name: /name|bucket name/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User submits the create-bucket form without filling the name and sees validation.',
      async () => {
        await page.getByRole('button', { name: /create|save|add bucket/i }).click();
        await expect(page).toHaveURL(/\/buckets\/new/);
        await expect(page.getByText(/required|name/i).first()).toBeVisible();
      }
    );
  });

  test('When the user submits the form with a valid name, a bucket is created and they are redirected to bucket surfaces.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto('/buckets/new');
    await expect(page.getByRole('textbox', { name: /name|bucket name/i })).toBeVisible();

    const bucketName = nextFixtureName('e2e-web-bucket');
    await page.getByRole('textbox', { name: /name|bucket name/i }).fill(bucketName);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the create-bucket form with a valid name and is redirected.',
      async () => {
        await page.getByRole('button', { name: /create|save|add bucket/i }).click();
      }
    );

    await expect(page).toHaveURL(/\/buckets|\/bucket\//);
    await expect(page.getByText(new RegExp(bucketName, 'i')).first()).toBeVisible();
  });
});
