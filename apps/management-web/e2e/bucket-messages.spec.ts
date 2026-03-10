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

const E2E_BUCKET1_ID = '22222222-2222-4222-a222-222222222222';

/**
 * Bucket messages route uses bucket-detail gate (canReadBuckets). Actor matrix: unauthenticated →
 * login; super-admin and admin with buckets read → see messages; limited-admin → redirect dashboard.
 */

test.describe('This suite verifies the management bucket-messages route and messages view: unauthenticated redirect, invalid bucket id→not found, permitted role sees list or empty, and URL params (tab, sort) contract.', () => {
  test('When an unauthenticated user tries to open the bucket-messages-page, they are redirected to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectUnauthedRouteRedirectsToLogin(
      page,
      testInfo,
      'User navigates to the management bucket-messages-page while not logged in and is redirected to the login-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
      }
    );
  });

  test('When the super-admin opens the bucket-messages-route with an invalid bucket id, they see not found.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to the bucket-messages-route with an invalid bucket id and sees not found.',
      async () => {
        await page.goto('/bucket/99999999-9999-4999-a999-999999999999/messages');
      }
    );
  });

  test('When a permitted user (super-admin) opens the bucket-messages-route, they are redirected to the bucket-detail-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the management bucket-messages-route and is redirected to the bucket-detail-page.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}(?:/|$)`));
    await capturePageLoad(
      page,
      testInfo,
      'The bucket-detail-page is visible after redirect from bucket-messages-route.'
    );
  });

  test('When a permitted user (super-admin) opens the bucket-detail-page with the messages tab, they see the messages list or empty state.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-detail-page with the messages tab and sees the messages list or empty state.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}?tab=messages`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}`));
    const emptyState = page.getByText(/no messages yet/i);
    const messageListOrEditLink = page.locator('a[href*="/messages/"]').first();
    await expect(emptyState.or(messageListOrEditLink)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The messages list or empty state is visible on the bucket-detail messages tab.'
    );
  });

  test('When the user opens the bucket-detail messages tab with sort=oldest, the URL preserves tab and sort and the messages panel is visible.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'super-admin (full CRUD)');
    await loginAsManagementSuperAdmin(page);
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the bucket-detail-page with tab=messages and sort=oldest; URL preserves params and messages panel is visible.',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_ID}?tab=messages&sort=oldest`);
      }
    );
    await expect(page).toHaveURL(/tab=messages/);
    await expect(page).toHaveURL(/sort=oldest/);
    const emptyState = page.getByText(/no messages yet/i);
    const messageListOrEditLink = page.locator('a[href*="/messages/"]').first();
    await expect(emptyState.or(messageListOrEditLink)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The messages panel is visible with tab and sort params in the URL.'
    );
  });

  test('When a limited-admin (no buckets read) opens the bucket-messages route, they are redirected to the dashboard.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'limited-admin (no buckets read)');
    await loginAsLimitedAdmin(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'The limited-admin is redirected to the dashboard when opening the bucket-messages route.'
    );
  });

  test('When an admin with buckets read opens the bucket-messages route, they are redirected to the bucket-detail-page and can see the messages tab.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'admin with buckets read (bucket-admins permission)');
    await loginAsManagementAdminWithBucketAdmins(page);
    await page.goto(`/bucket/${E2E_BUCKET1_ID}/messages`);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_ID}(?:/|$)`));
    await expect(page.getByRole('link', { name: /messages/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The admin with buckets read sees the bucket-detail-page and messages tab.'
    );
  });
});
