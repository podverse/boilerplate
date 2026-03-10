import { expect, test } from '@playwright/test';

import { loginAsWebE2EAdminWithoutPermission } from './helpers/advancedFixtures';
import { setE2EUserContext } from './helpers/userContext';

const E2E_BUCKET1_SHORT_ID = 'e2ebkt000001';
const NESTED_NEW_URL = `/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`;

test.describe('This suite verifies the nested-bucket-create-page for the non-owner admin (read-only, no create) user.', () => {
  test('When the non-owner admin without bucket create (read-only) opens the nested-bucket-create-page, they see the add-bucket form.', async ({
    page,
  }, testInfo) => {
    setE2EUserContext(testInfo, 'non-owner admin (read-only, no create)');
    await loginAsWebE2EAdminWithoutPermission(page);
    await page.goto(NESTED_NEW_URL);
    await expect(page).toHaveURL(new RegExp(`/bucket/${E2E_BUCKET1_SHORT_ID}/bucket/new`));
    await expect(page.getByRole('heading', { name: /add bucket/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add bucket|create|save/i })).toBeVisible();
  });
});
