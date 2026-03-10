import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EAdminWithPermission,
  loginAsWebE2EAdminWithoutPermission,
  loginAsWebE2ENonAdmin,
  loginAsWebE2EUserAndExpectDashboard,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

/**
 * Permission: parent bucket create/update (bucket_admin role or owner). Actor matrix: unauthenticated
 * → login; owner and non-owner admin with bucket create → see form; non-owner admin without
 * create (read-only) and non-admin → not found; invalid parent id → not found.
 */
test.describe('This suite verifies the child-bucket-create-page: unauthenticated redirect, form visibility, validation, Cancel→detail, valid create→detail, list→new flow, and not found for restricted actors.', () => {
  test('When an unauthenticated user tries to open the page to create a new child bucket, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}/new`,
      'User navigates to the child-bucket-create-page while not logged in and is redirected to the login-page.',
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
        await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
        await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
      }
    );
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
        await expect(page).toHaveURL(
          new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?$`)
        );
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-detail-page (buckets-tab) is visible after Cancel.'
    );
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
        await expect(page).toHaveURL(
          new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?$`)
        );
        await expect(page.getByText(new RegExp(bucketName, 'i')).first()).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-detail-page shows the new child bucket after create.'
    );
  });

  test('When the owner navigates from the bucket-detail-page (buckets-tab) to the child-bucket-create-page, they see the child-bucket-create-form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}?tab=buckets`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}(\\?tab=buckets)?`));
    const addBucketLink = page.getByRole('link', { name: /add bucket|new bucket/i });
    await expect(addBucketLink.first()).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the add-bucket link from the bucket-detail-page buckets-tab and reaches the child-bucket-create-page.',
      async () => {
        await addBucketLink.first().click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The child-bucket-create-form is visible after navigating from the bucket-detail-page.'
    );
  });

  test('When the non-owner admin with bucket permission opens the child-bucket-create-page, they see the create form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-admin');
    await loginAsWebE2EAdminWithPermission(page);
    await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The child-bucket-create-form is visible for the non-owner admin with bucket permission.'
    );
  });

  test('When the non-admin opens the child-bucket-create-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-admin');
    await loginAsWebE2ENonAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the child-bucket-create-page and sees not found (no bucket access).',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
      }
    );
  });

  test('When the user opens the child-bucket-create-page with an invalid parent bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the child-bucket-create-page with an invalid parent bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/invalid-parent-99999/new');
      }
    );
  });

  test('When the non-owner admin without bucket create (read-only) opens the child-bucket-create-page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-owner admin (read-only, no create)');
    await loginAsWebE2EAdminWithoutPermission(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User opens the child-bucket-create-page without bucket create permission and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}/new`);
      }
    );
  });
});
