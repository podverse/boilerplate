import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the web forgot-password-page for the unauthenticated user.', () => {
  test('When an unauthenticated user visits the forgot-password-page, they see the forgot-password form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the forgot-password-page and sees the form.',
      async () => {
        await page.goto('/forgot-password');
      }
    );
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /send|submit|reset password|forgot|reset link/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /log in|back/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The forgot-password form is fully visible with email field and submit button.'
    );
  });

  test('When the user submits with an empty email, a validation error is shown and they remain on the forgot-password-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

    await actionAndCapture(
      page,
      testInfo,
      'User submits the form with an empty email and sees a validation error.',
      async () => {
        await page
          .getByRole('button', { name: /send|submit|reset password|forgot|reset link/i })
          .click();
        await expect(
          page
            .getByText(/required|Enter.*email|email.*required/i)
            .or(page.getByRole('alert').filter({ hasText: /email|required/i }))
        ).toBeVisible();
        await expect(page).toHaveURL(/\/forgot-password/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The forgot-password-page shows validation when email is empty.'
    );
  });

  test('When the user submits with an invalid email format, a validation error is shown and they remain on the forgot-password-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@email');

    await actionAndCapture(
      page,
      testInfo,
      'User submits with an invalid email format and sees a validation error.',
      async () => {
        await page
          .getByRole('button', { name: /send|submit|reset password|forgot|reset link/i })
          .click();
        await expect(
          page.getByText(/Enter a valid email address|Invalid email|valid email/i)
        ).toBeVisible();
        await expect(page).toHaveURL(/\/forgot-password/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The forgot-password-page shows invalid-email validation.'
    );
  });

  test('When the user submits with a valid email, a success message is shown.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User submits a valid email and sees the success message.',
      async () => {
        await page.getByRole('textbox', { name: /email/i }).fill('e2e@example.com');
        await page
          .getByRole('button', { name: /send|submit|reset password|forgot|reset link/i })
          .click();
        await expect(
          page.getByText(/Check your email|If an account exists|sent|reset link/i)
        ).toBeVisible();
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The forgot-password-page shows the success view after submit.'
    );
  });

  test('When the user clicks the log in link, they are taken to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/forgot-password');
    await expect(page.getByRole('link', { name: /log in|back/i }).first()).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the log in link and is navigated to the login-page.',
      async () => {
        await page
          .getByRole('link', { name: /log in|back/i })
          .first()
          .click();
        await expect(page).toHaveURL(/\/login/);
      }
    );
    await capturePageLoad(page, testInfo, 'The login-page is visible.');
  });
});
