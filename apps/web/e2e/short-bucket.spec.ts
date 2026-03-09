import { expect, test } from '@playwright/test';

import { loginAsWebE2EUserAndExpectDashboard } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';
const E2E_BUCKET2_SHORT_ID = 'e2ebkt000002';

test.describe('Short bucket (public)', () => {
  test('public bucket by short id shows bucket name and content', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-public-short-bucket-url-and-expect-bucket-name-visible',
      async () => {
        await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page.getByText('E2E Bucket One')).toBeVisible();
    await capturePageLoad(page, testInfo, 'public-short-bucket-page-shows-E2E-Bucket-One-name');
  });

  test('send message link present on public bucket page', async ({ page }, testInfo) => {
    await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}`);
    await expect(page.getByRole('link', { name: /submit a message|send message/i })).toBeVisible();
  });

  test('invalid short id shows 404', async ({ page }, testInfo) => {
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'navigate-to-invalid-short-bucket-id-expect-not-found',
      async () => {
        await page.goto('/b/invalid-short-id-99999');
      }
    );
  });

  test('private bucket short id does not expose private bucket content', async ({
    page,
  }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-private-short-bucket-url-and-expect-no-private-bucket-content-leak',
      async () => {
        await page.goto(`/b/${E2E_BUCKET2_SHORT_ID}`);
      }
    );
    await expect(page.getByText(/E2E Bucket Two/i)).toHaveCount(0);
  });

  test('authenticated user can view the same public short bucket route', async ({
    page,
  }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'authenticated-user-navigates-to-public-short-bucket-and-sees-bucket-name',
      async () => {
        await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}`));
    await expect(page.getByText(/E2E Bucket One/i)).toBeVisible();
  });
});
