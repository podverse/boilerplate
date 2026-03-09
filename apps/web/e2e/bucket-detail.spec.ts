import { expect, test } from '@playwright/test';

import {
  expectUnauthedRouteRedirectsToLogin,
  loginAsWebE2EUserAndExpectDashboard,
} from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Bucket detail', () => {
  test('unauthenticated user is redirected to login', async ({ page }, testInfo) => {
    await expectUnauthedRouteRedirectsToLogin(
      page,
      `/bucket/${E2E_BUCKET1_SHORT_ID}`,
      'navigate-to-bucket-detail-while-unauthenticated-expect-redirect-to-login',
      testInfo
    );
  });

  test('authenticated user sees bucket detail for seeded bucket', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-detail-by-short-id-expect-bucket-name-and-content',
      async () => {
        await page.goto(`/bucket/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}`));
    await expect(page.getByText('E2E Bucket One')).toBeVisible();
    await expect(page.getByRole('link', { name: /messages/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'bucket-detail-page-shows-bucket-name-E2E-Bucket-One-and-settings-or-messages-links'
    );
  });

  test('invalid bucket id shows 404', async ({ page }, testInfo) => {
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-bucket-with-invalid-id-expect-not-found',
      async () => {
        await page.goto('/bucket/nonexistent-bucket-id-99999');
      }
    );
    await expect(page.getByText(/not found|404|does not exist/i).first()).toBeVisible();
  });
});
