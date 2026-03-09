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
    await expect(page.getByRole('heading', { name: /send a message/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /your name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /message/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible();
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
    await expect(page.getByText(/not found|404|invalid/i).first()).toBeVisible();
  });

  test('empty send-message form keeps submit disabled until required fields are filled', async ({
    page,
  }, testInfo) => {
    await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await expect(submitButton).toBeDisabled();
    await actionAndCapture(
      page,
      testInfo,
      'fill-required-public-send-message-fields-and-expect-submit-button-enabled',
      async () => {
        await page.getByRole('textbox', { name: /your name/i }).fill('E2E Sender');
        await page.getByRole('textbox', { name: /message/i }).fill('E2E public message body');
      }
    );
    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`));
    await expect(submitButton).toBeEnabled();
  });

  test('valid send-message form submits and redirects back to public bucket', async ({
    page,
  }, testInfo) => {
    await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
    await page.getByRole('textbox', { name: /your name/i }).fill('E2E Sender');
    await page.getByRole('textbox', { name: /message/i }).fill('E2E public message body');

    await actionAndCapture(
      page,
      testInfo,
      'submit-valid-public-send-message-form-and-expect-public-bucket-redirect',
      async () => {
        await page.getByRole('button', { name: /send|submit/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}$`));
  });
});
