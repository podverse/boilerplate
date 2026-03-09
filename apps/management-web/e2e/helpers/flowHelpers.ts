import { expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

import { actionAndCapture } from './stepScreenshots';

/** Asserts the 404 (not-found) page is visible. Use for any test that expects the custom not-found page. */
export async function expectNotFoundPageVisible(page: Page): Promise<void> {
  await expect(page.getByTestId('not-found-page')).toBeVisible();
}

export async function expectInvalidRouteShowsNotFound(
  page: Page,
  testInfo: TestInfo,
  stepLabel: string,
  action: () => Promise<void>
): Promise<void> {
  await actionAndCapture(page, testInfo, stepLabel, async () => {
    await action();
    await expectNotFoundPageVisible(page);
  });
}

export async function clickConfirmDeleteInModal(page: Page): Promise<void> {
  const confirmDeleteButton = page
    .locator('button')
    .filter({ hasText: /delete/i })
    .last();
  await expect(confirmDeleteButton).toBeVisible();
  await confirmDeleteButton.click();
}
