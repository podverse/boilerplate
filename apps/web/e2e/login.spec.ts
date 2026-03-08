import { expect, test } from '@playwright/test';

import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';

const E2E_EMAIL = 'e2e@example.com';
const E2E_PASSWORD = 'Test!1Aa';

test.describe('Login', () => {
  test('shows login form when unauthenticated', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-login-page-and-expect-form-visible-for-unauthenticated-user',
      async () => {
        await page.goto('/login');
      }
    );
    await expect(page.getByRole('textbox', { name: /email|username/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'login-form-fully-visible-with-email-password-and-submit-button'
    );
  });

  test('valid credentials redirect to dashboard', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-login-page-before-entering-valid-seeded-credentials',
      async () => {
        await page.goto('/login');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'fill-email-and-password-with-seeded-e2e-user-then-submit',
      async () => {
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await capturePageLoad(
      page,
      testInfo,
      'dashboard-visible-after-successful-login-with-seeded-user'
    );
  });

  test('invalid credentials show error and do not redirect', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-login-page-before-entering-invalid-credentials',
      async () => {
        await page.goto('/login');
      }
    );
    await actionAndCapture(
      page,
      testInfo,
      'fill-wrong-password-and-submit-expect-error-message',
      async () => {
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill('WrongPassword1!');
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid|incorrect|wrong|error/i)).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'login-page-still-visible-with-error-message-after-invalid-credentials'
    );
  });

  test('authenticated user visiting /login redirects to dashboard', async ({ page }, testInfo) => {
    await actionAndCapture(
      page,
      testInfo,
      'log-in-with-seeded-user-first-to-establish-session',
      async () => {
        await page.goto('/login');
        await page.getByRole('textbox', { name: /email|username/i }).fill(E2E_EMAIL);
        await page.getByLabel(/password/i).fill(E2E_PASSWORD);
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
    await actionAndCapture(
      page,
      testInfo,
      'navigate-to-login-while-authenticated-expect-redirect-to-dashboard',
      async () => {
        await page.goto('/login');
      }
    );
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('sign up link goes to signup page', async ({ page }, testInfo) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'click-sign-up-link-and-verify-navigation-to-signup-page',
      async () => {
        await page.getByRole('link', { name: /sign up/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/signup/);
  });

  test('forgot password link goes to forgot-password page', async ({ page }, testInfo) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
    await actionAndCapture(
      page,
      testInfo,
      'click-forgot-password-link-and-verify-navigation-to-forgot-password-page',
      async () => {
        await page.getByRole('link', { name: /forgot password/i }).click();
      }
    );
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});
