import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
  nextFixtureName,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

/**
 * Permission: canReadBuckets then bucketsCrud create; else redirect dashboard or notFound. Actor
 * matrix: unauthenticated → login; super-admin → form; limited-admin (no buckets read) → redirect
 * dashboard; admin with buckets read but no create (e.g. admin-with-bucket-admins) → notFound.
 */

test.describe('This suite verifies the management bucket-child-new page: unauthenticated redirect, invalid parent id→not found, permitted role sees form, create success and validation, and flow from bucket-detail to child-new form.', () => {
  test('When an unauthenticated user tries to open the bucket-child-new page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-child-new page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
  });

  test('When the super-admin opens the bucket-child-new page with an invalid parent bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-child-new page with an invalid parent bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/99999999-9999-4999-a999-999999999999/new');
      }
    );
  });

  test('When a permitted user (super-admin) opens the bucket-child-new page, they see the child-bucket create form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-child-new page and sees the create form.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-child-new form is visible with name and submit button.'
    );
  });

  test('When the super-admin navigates from the bucket-detail Buckets tab to the child-new page via the Add bucket link, they see the child-bucket create form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}?tab=buckets`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    const addBucketLink = page.getByRole('link', { name: /add bucket/i });
    await expect(addBucketLink).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User clicks the Add bucket link and is taken to the bucket-child-new page.',
      async () => {
        await addBucketLink.click();
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/new`));
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-child-new form is visible after navigating from bucket-detail.'
    );
  });

  test('When the user submits the child-bucket form with an empty name, a validation error is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
    await expect(page.getByRole('textbox', { name: /name|bucket/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the form with an empty name and sees a validation error.',
      async () => {
        await page.getByRole('button', { name: /add bucket|create|save/i }).click();
      }
    );
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}/new`));
    await capturePageLoad(
      page,
      testInfo,
      'The form remains on the page with validation error visible.'
    );
  });

  test('When the user submits the child-bucket form with a valid name, they are redirected to the parent bucket Buckets tab and the new bucket appears in the list.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    const childName = nextFixtureName('e2e-child-bucket');
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
    await page.getByRole('textbox', { name: /name|bucket/i }).fill(childName);

    await actionAndCapture(
      page,
      testInfo,
      'User submits the form with a valid name and is redirected to the parent bucket Buckets tab with the new bucket in the list.',
      async () => {
        await page.getByRole('button', { name: /add bucket|create|save/i }).click();
        await expect(page).toHaveURL(/\/bucket\/.+\?tab=buckets/);
      }
    );
    await expect(page.getByText(childName).first()).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The parent bucket Buckets tab shows the newly created child bucket.'
    );
  });

  test('When a limited-admin (no buckets read) opens the bucket-child-new page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets read)');
    await loginAsLimitedAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when opening the bucket-child-new page.'
    );
  });

  test('When an admin with buckets read but without buckets create opens the bucket-child-new page, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read, no create');
    await loginAsManagementAdminWithBucketAdmins(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User opens the bucket-child-new page without buckets create permission and sees not found.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/new`);
      }
    );
  });
});
