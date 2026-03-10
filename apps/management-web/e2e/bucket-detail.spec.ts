import { expect, test } from '@playwright/test';

import {
  loginAsLimitedAdmin,
  loginAsManagementAdminWithBucketAdmins,
  loginAsManagementSuperAdmin,
} from './helpers/advancedFixtures';
import { expectUnauthedRouteRedirectsToLogin } from './helpers/authAssertions';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

/** UUID from tools/web/seed-e2e.mjs E2E_BUCKET1_ID (main DB; management E2E runs after full seed). */
const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

/**
 * Permission: canReadBuckets (bucketsCrud read) required; else redirect dashboard. Actor matrix:
 * unauthenticated → login; super-admin and admin with buckets read → see detail and tabs;
 * limited-admin (no buckets read) → redirect dashboard.
 */

test.describe('This suite verifies the management bucket-detail-page: unauthenticated redirect, invalid bucket id→not found, permitted role sees detail and action links (Messages, Buckets, Settings).', () => {
  test('When an unauthenticated user tries to open the bucket-detail-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-detail-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
      }
    );
  });

  test('When the super-admin opens the bucket-detail-page with an invalid bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-detail-page with an invalid bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/99999999-9999-4999-a999-999999999999');
      }
    );
  });

  test('When a permitted user (super-admin) opens the bucket-detail-page, they see the bucket name and the Messages, Buckets, and Settings tab links.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management bucket-detail-page and sees the bucket name and Messages, Buckets, and Settings tabs.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    await expect(page.getByText(/E2E Bucket One/)).toBeVisible();
    await expect(page.getByRole('link', { name: /messages/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /buckets/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-detail-page is visible with bucket name and Messages, Buckets, and Settings tab links.'
    );
  });

  test('When a limited-admin (no buckets read) opens the bucket-detail-page, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets read)');
    await loginAsLimitedAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when opening the bucket-detail-page.'
    );
  });

  test('When an admin with buckets read opens the bucket-detail-page, they see the bucket name and Messages, Buckets, and Settings tab links.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    await expect(page.getByText(/E2E Bucket One/)).toBeVisible();
    await expect(page.getByRole('link', { name: /messages/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admin with buckets read sees the bucket-detail-page with tabs.'
    );
  });
});
