import { expect } from '@playwright/test';
import type { APIRequestContext, Page, TestInfo } from '@playwright/test';

import { actionAndCapture } from './stepScreenshots';

const WEB_LOGIN_EMAIL = 'e2e@example.com';
const WEB_LOGIN_PASSWORD = 'Test!1Aa';

export const nextFixtureName = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function loginAsWebE2EUserAndExpectDashboard(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByRole('textbox', { name: /email|username/i }).fill(WEB_LOGIN_EMAIL);
  await page.getByLabel(/password/i).fill(WEB_LOGIN_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

export async function loginAsWebE2EUser(page: Page): Promise<void> {
  await loginAsWebE2EUserAndExpectDashboard(page);
}

export async function expectUnauthedRouteRedirectsToLogin(
  page: Page,
  route: string,
  stepLabel: string,
  testInfo: TestInfo
): Promise<void> {
  await actionAndCapture(page, testInfo, stepLabel, async () => {
    await page.goto(route);
  });
  await expect(page).toHaveURL(/\/login/);
}

export async function createChildBucketFixture(
  request: APIRequestContext,
  parentBucketShortId: string
): Promise<{ id: string; shortId: string; name: string }> {
  const name = nextFixtureName('e2e-web-child-bucket');
  const response = await request.post(`/api/buckets/${parentBucketShortId}/buckets`, {
    data: { name, isPublic: true },
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to create child bucket fixture: ${response.status()} ${response.statusText()}`
    );
  }
  const data = (await response.json()) as {
    bucket?: { id: string; shortId?: string; name?: string };
  };
  const bucket = data.bucket;
  if (bucket === undefined || typeof bucket.id !== 'string') {
    throw new Error('Child bucket fixture response missing bucket id');
  }
  return {
    id: bucket.id,
    shortId: typeof bucket.shortId === 'string' ? bucket.shortId : bucket.id,
    name: typeof bucket.name === 'string' ? bucket.name : name,
  };
}

export async function createBucketRoleFixture(
  request: APIRequestContext,
  bucketShortId: string
): Promise<{ id: string; name: string }> {
  const name = nextFixtureName('e2e-web-bucket-role');
  const response = await request.post(`/api/buckets/${bucketShortId}/roles`, {
    data: { name, bucketCrud: 2, messageCrud: 2, adminCrud: 2 },
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to create bucket role fixture: ${response.status()} ${response.statusText()}`
    );
  }
  const data = (await response.json()) as { role?: { id: string; name?: string } };
  const role = data.role;
  if (role === undefined || typeof role.id !== 'string') {
    throw new Error('Bucket role fixture response missing role id');
  }
  return { id: role.id, name: typeof role.name === 'string' ? role.name : name };
}

export async function createAdminInvitationFixture(
  request: APIRequestContext,
  bucketShortId: string,
  email: string
): Promise<{ token: string }> {
  const response = await request.post(`/api/buckets/${bucketShortId}/invitations`, {
    data: { email, bucketCrud: 2, messageCrud: 2 },
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to create admin invitation fixture: ${response.status()} ${response.statusText()}`
    );
  }
  const data = (await response.json()) as { invitation?: { token?: string } };
  const token = data.invitation?.token;
  if (typeof token !== 'string' || token === '') {
    throw new Error('Admin invitation fixture response missing token');
  }
  return { token };
}
