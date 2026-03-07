import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

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
    await expect(
      page
        .getByRole('link', { name: /send message/i })
        .or(page.getByRole('button', { name: /send message/i }))
    ).toBeVisible();
  });

  test('invalid short id shows 404', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-invalid-short-bucket-id-expect-not-found',
      async () => {
        await page.goto('/b/invalid-short-id-99999');
      }
    );
    await expect(
      page.getByText(/not found|404/i).or(page.getByRole('heading', { name: /not found|404/i }))
    ).toBeVisible();
  });
});
