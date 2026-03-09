import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the forgot-password page.', () => {
  test('When an unauthenticated user visits the forgot-password page, they see the forgot-password form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the forgot-password page and sees the form.',
      async () => {
        await page.goto('/forgot-password');
      }
    );
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /send|submit|reset password|forgot/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /log in|back/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The forgot-password form is fully visible with email field and submit button.'
    );
  });

  test('When the user submits an email, a success or error message is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User submits an email and sees a success or error message without email enumeration.',
      async () => {
        await page.getByRole('textbox', { name: /email/i }).fill('e2e@example.com');
        await page.getByRole('button', { name: /send|submit|reset password|forgot/i }).click();
        await expect(
          page.getByText(
            /sent|check your email|if an account exists|error|invalid|not enabled|verification/i
          )
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The forgot-password page shows success or error after submit.'
    );
  });

  test('When the user clicks the log in link, they are taken to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await expect(page.getByRole('link', { name: /log in|back/i }).first()).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the log in link and is navigated to the login page.',
      async () => {
        await page
          .getByRole('link', { name: /log in|back/i })
          .first()
          .click();
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('When the user submits without entering an email, they remain on the forgot-password page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the empty forgot-password form and stays on the page.',
      async () => {
        await page.getByRole('button', { name: /send|submit|reset password|forgot/i }).click();
        await expect(page).toHaveURL(/\/forgot-password/);
        await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
      }
    );
  });
});
