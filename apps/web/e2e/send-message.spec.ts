import { expect, test } from '@playwright/test';

import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';

test.describe('This suite verifies the public send-message page for a bucket.', () => {
  test('When the user opens the public send-message page, they see the form or CTA.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the public send-message URL and sees the form or CTA.',
      async () => {
        await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
      }
    );
    await expect(page.getByRole('heading', { name: /send a message/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /your name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /message/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The public send-message page shows the form or send button.'
    );
  });

  test('When the user opens the send-message page with an invalid short id, they see a 404 or error.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to send-message with an invalid short id and sees not found.',
      async () => {
        await page.goto('/b/invalid-short-99999/send-message');
      }
    );
  });

  test('When the send-message form is empty, the submit button stays disabled until required fields are filled.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
    await expect(page.getByRole('textbox', { name: /your name/i })).toBeVisible();
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await expect(submitButton).toBeDisabled();
    await actionAndCapture(
      page,
      testInfo,
      'User fills the required public send-message fields and the submit button becomes enabled.',
      async () => {
        await page.getByRole('textbox', { name: /your name/i }).fill('E2E Sender');
        await page.getByRole('textbox', { name: /message/i }).fill('E2E public message body');
      }
    );
    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`));
    await expect(submitButton).toBeEnabled();
  });

  test('When the user submits a valid send-message form, they are redirected back to the public bucket.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}/send-message`);
    await expect(page.getByRole('textbox', { name: /your name/i })).toBeVisible();
    await page.getByRole('textbox', { name: /your name/i }).fill('E2E Sender');
    await page.getByRole('textbox', { name: /message/i }).fill('E2E public message body');

    await actionAndCapture(
      page,
      testInfo,
      'User submits the valid public send-message form and is redirected to the public bucket.',
      async () => {
        await page.getByRole('button', { name: /send|submit/i }).click();
      }
    );

    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}$`));
  });
});
