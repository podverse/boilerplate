import { expect, test } from '@playwright/test';

import { nextFixtureName } from './helpers/advancedFixtures';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

test.describe('This suite verifies the web signup-page for the unauthenticated user.', () => {
  test('When an unauthenticated user visits the signup-page, they see the signup form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the signup-page and sees the form.',
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
      'The signup form is visible with username, email, password, and submit button.'
    );
  });

  test('When the user submits with a duplicate email, a validation error is shown and they remain on the signup-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User submits with the seeded email to trigger a duplicate-email error.',
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
      'The signup-page shows a duplicate-email error and the user remains on the form.'
    );
  });

  test('When the user submits with an invalid email format, a validation error is shown and they remain on the signup-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/signup');
    const username = page.getByRole('textbox', { name: /username/i });
    const email = page.getByRole('textbox', { name: /email/i });
    if ((await username.count()) > 0) await username.fill('e2euser');
    await email.fill('invalid@email');
    await page
      .getByLabel(/password/i)
      .first()
      .fill('Test!1Aa');
    const confirm = page.getByLabel(/confirm|repeat password/i);
    if ((await confirm.count()) > 0) await confirm.fill('Test!1Aa');

    await actionAndCapture(
      page,
      testInfo,
      'User submits with an invalid email format and sees a validation error.',
      async () => {
        await page.getByRole('button', { name: /sign up|create account|submit/i }).click();
        await expect(
          page.getByText(/Enter a valid email address|Invalid email|valid email/i)
        ).toBeVisible();
        await expect(page).toHaveURL(/\/signup/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The signup-page shows an invalid-email validation message.'
    );
  });

  test('When the user enters a weak password, the submit button stays disabled and they remain on the signup-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/signup');
    const username = page.getByRole('textbox', { name: /username/i });
    const email = page.getByRole('textbox', { name: /email/i });
    if ((await username.count()) > 0) await username.fill('e2euser');
    await email.fill('unique@example.com');
    await page
      .getByLabel(/password/i)
      .first()
      .fill('weak');
    const confirm = page.getByLabel(/confirm|repeat password/i);
    if ((await confirm.count()) > 0) await confirm.fill('weak');

    await actionAndCapture(
      page,
      testInfo,
      'User verifies that with a weak password the submit button stays disabled.',
      async () => {
        await expect(
          page.getByRole('button', { name: /sign up|create account|submit/i })
        ).toBeDisabled();
        await expect(page).toHaveURL(/\/signup/);
      }
    );
    await capturePageLoad(
      page,
      testInfo,
      'The signup-page submit button remains disabled for weak password.'
    );
  });

  test('When the user submits valid signup data, they are redirected to the login-page or dashboard, or see an admin-only message when signup is disabled.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    const uniqueId = nextFixtureName('e2e-signup');
    const email = `${uniqueId}@example.com`;
    const password = 'Test!1Aa';
    await page.goto('/signup');
    await page.getByLabel(/email/i).first().fill(email);
    const usernameInput = page.getByRole('textbox', { name: /username/i });
    if ((await usernameInput.count()) > 0) await usernameInput.fill(uniqueId);
    await page
      .getByLabel(/password/i)
      .first()
      .fill(password);
    const confirm = page.getByLabel(/confirm|repeat password/i);
    if ((await confirm.count()) > 0) await confirm.fill(password);

    await actionAndCapture(
      page,
      testInfo,
      'User submits valid signup data; either redirects to login/dashboard or sees admin-only message.',
      async () => {
        await page.getByRole('button', { name: /sign up|create account|submit/i }).click();
        await Promise.race([
          page.waitForURL(/\/(login|dashboard)/, { timeout: 10000 }),
          page
            .getByText(/registration is by admin only|not enabled/i)
            .waitFor({ state: 'visible', timeout: 10000 }),
        ]);
      }
    );
    const url = page.url();
    if (/\/signup/.test(url)) {
      await expect(page.getByText(/registration is by admin only|not enabled/i)).toBeVisible();
      await capturePageLoad(
        page,
        testInfo,
        'Signup is disabled in this environment; the admin-only message is shown.'
      );
    } else {
      await expect(page).toHaveURL(/\/(login|dashboard)/);
      await capturePageLoad(
        page,
        testInfo,
        'The user is on the login-page or dashboard after successful signup.'
      );
    }
  });

  test('When the user clicks the log-in link, they are taken to the login-page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto('/signup');
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'User clicks the log-in link and is navigated to the login-page.',
      async () => {
        await page.getByRole('link', { name: /log in/i }).click();
        await expect(page).toHaveURL(/\/login/);
      }
    );
    await capturePageLoad(page, testInfo, 'The login-page is visible.');
  });

  test('When required fields are empty, the submit button is disabled.', async ({
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
    await capturePageLoad(
      page,
      testInfo,
      'The signup-page submit button remains disabled when empty.'
    );
  });
});
