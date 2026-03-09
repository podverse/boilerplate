import { expect, test } from '@playwright/test';

import { loginAsWebE2EUserAndExpectDashboard } from './helpers/advancedFixtures';
import { expectInvalidRouteShowsNotFound } from './helpers/flowHelpers';
import { actionAndCapture, capturePageLoad } from './helpers/stepScreenshots';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';
const E2E_BUCKET2_SHORT_ID = 'e2ebkt000002';

test.describe('This suite verifies public short-bucket URLs by short id.', () => {
  test('When the user opens a public short-bucket URL by short id, they see the bucket name and content.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the public short-bucket URL and sees the bucket name.',
      async () => {
        await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page.getByText('E2E Bucket One')).toBeVisible();
    await capturePageLoad(
      page,
      testInfo,
      'The public short-bucket page shows the E2E Bucket One name.'
    );
  });

  test('When the user is on the public short-bucket page, the send-message link is present.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}`);
    await expect(page.getByRole('link', { name: /submit a message|send message/i })).toBeVisible();
  });

  test('When the user opens an invalid short-bucket id, they see a 404 page.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await expectInvalidRouteShowsNotFound(
      page,
      testInfo,
      'User navigates to an invalid short-bucket id and sees not found.',
      async () => {
        await page.goto('/b/invalid-short-id-99999');
      }
    );
  });

  test('When the user opens a private short-bucket URL by short id, private bucket content is not exposed.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'unauthenticated');
    await actionAndCapture(
      page,
      testInfo,
      'User navigates to the private short-bucket URL and no private bucket content is leaked.',
      async () => {
        await page.goto(`/b/${E2E_BUCKET2_SHORT_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET2_SHORT_ID}`));
    await expect(page.getByText(/E2E Bucket Two/i)).toHaveCount(0);
  });

  test('When an authenticated user opens the public short-bucket route, they see the same bucket name.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'seeded-bucket-owner');
    await loginAsWebE2EUserAndExpectDashboard(page);
    await actionAndCapture(
      page,
      testInfo,
      'The authenticated user navigates to the public short-bucket route and sees the bucket name.',
      async () => {
        await page.goto(`/b/${E2E_BUCKET1_SHORT_ID}`);
      }
    );
    await expect(page).toHaveURL(new RegExp(`/b/${E2E_BUCKET1_SHORT_ID}`));
    await expect(page.getByText(/E2E Bucket One/i)).toBeVisible();
  });
});
