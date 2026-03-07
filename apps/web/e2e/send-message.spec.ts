import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('Send message (public)', () => {
  test('public send-message page shows form or CTA', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-public-send-message-url-and-expect-form-or-cta',
      async () => {
        await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
      }
    );
    await expect(
      page.getByRole('textbox').or(page.getByRole('button', { name: /send|submit/i }))
    ).toBeVisible();
    await capturePageLoad(page, testInfo, 'public-send-message-page-shows-form-or-send-button');
  });

  test('invalid short id shows 404 or error', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-send-message-invalid-short-id-expect-not-found-or-error',
      async () => {
        await page.goto('/b/invalid-short-99999/send-message');
      }
    );
    await expect(
      page
        .getByText(/not found|404|invalid/i)
        .or(page.getByRole('heading', { name: /not found|404/i }))
    ).toBeVisible();
  });
});
