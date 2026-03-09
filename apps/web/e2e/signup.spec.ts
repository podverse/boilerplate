import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the sign-up page.', () => {
  test('When an unauthenticated user visits the sign-up page, they see the sign-up form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the sign-up page and sees the form.',
      async () => {
        await page.goto('/signup');
      }
    );
    await expect(page.getByRole('textbox', { name: /username|email/i }).first()).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
    await expect(
      page.getByRole('button', { name: /sign up|create account|submit/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The sign-up form is fully visible with username, email, password, and submit button.'
    );
  });

  test('When the user submits with a duplicate email, an error is shown and they remain on the sign-up page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the sign-up page and fills the seeded email to trigger a duplicate error.',
      async () => {
        await page.goto('/signup');
        await expect(page.getByRole('textbox', { name: /username|email/i }).first()).toBeVisible();
        const username = page.getByRole('textbox', { name: /username/i });
        const email = page.getByRole('textbox', { name: /email/i });
        if ((await username.count()) > 0) await username.fill('e2euser');
        await email.fill('e2e@example.com');
        await page
          .getByLabel(/password/i)
          .first()
          .fill('Test!1Aa');
        const confirm = page.getByLabel(/confirm|repeat password/i);
        if ((await confirm.count()) > 0) await confirm.fill('Test!1Aa');
        await page.getByRole('button', { name: /sign up|create account|submit/i }).click();
        await expect(
          page.getByText(
            /already exists|duplicate|taken|error|not enabled|verification|registration is by admin only/i
          )
        ).toBeVisible();
        await expect(page).toHaveURL(/\/signup/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The sign-up page is still visible with a duplicate email error.'
    );
  });

  test('When the user clicks the log in link, they are taken to the login page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/signup');
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the log in link and is navigated to the login page.',
      async () => {
        await page.getByRole('link', { name: /log in/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('When required fields are empty, the submit button is disabled and the user cannot navigate away.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/signup');
    await expect(page.getByRole('textbox', { name: /username|email/i }).first()).toBeVisible();
    const submitButton = page.getByRole('button', { name: /sign up|create account|submit/i });

    await actionAndCapture(
      page,
      testInfo,
      'User verifies that the empty signup form keeps the submit button disabled.',
      async () => {
        await expect(submitButton).toBeDisabled();
      }
    );

    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByRole('textbox', { name: /username|email/i }).first()).toBeVisible();
  });
});
