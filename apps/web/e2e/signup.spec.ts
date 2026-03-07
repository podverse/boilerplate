import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

test.describe('Sign up', () => {
  test('shows signup form when unauthenticated', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-signup-page-and-expect-form-visible',
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
      'signup-form-fully-visible-with-username-email-password-and-submit'
    );
  });

  test('duplicate email shows error and does not redirect', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-signup-and-fill-seeded-email-to-trigger-duplicate-error',
      async () => {
        await page.goto('/signup');
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
      }
    );
    await expect(
      page.getByRole('alert').or(page.getByText(/already exists|duplicate|taken|error/i))
    ).toBeVisible();
    await expect(page).toHaveURL(/\/signup/);
    await capturePageLoad(page, testInfo, 'signup-page-still-visible-with-duplicate-email-error');
  });

  test('log in link goes to login page', async ({ page }, testInfo) => {
    await page.goto('/signup');
    await actionAndCapture(
      page,
      testInfo,
      'click-log-in-link-and-verify-navigation-to-login-page',
      async () => {
        await page.getByRole('link', { name: /log in/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/login/);
  });
});
