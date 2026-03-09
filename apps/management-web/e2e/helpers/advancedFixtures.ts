import { expect } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';

const MANAGEMENT_LOGIN_USERNAME = 'e2e-superadmin';
const MANAGEMENT_LOGIN_PASSWORD = 'Test!1Aa';

export const nextFixtureName = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function loginAsManagementSuperAdmin(page: Page): Promise<void> {
  await page.goto('/login');
  await expect(page.getByRole('textbox', { name: /username|email/i })).toBeVisible();
  await page.getByRole('textbox', { name: /username|email/i }).fill(MANAGEMENT_LOGIN_USERNAME);
  await page.getByLabel(/password/i).fill(MANAGEMENT_LOGIN_PASSWORD);
  await page.getByRole('button', { name: /log in|sign in|submit/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

export async function createChildBucketFixture(
  request: APIRequestContext,
  parentBucketId: string
): Promise<{ id: string; shortId: string; name: string }> {
  const name = nextFixtureName('e2e-child-bucket');
  const response = await request.post(`/api/management/buckets/${parentBucketId}/buckets`, {
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
  bucketId: string
): Promise<{ id: string; name: string }> {
  const name = nextFixtureName('e2e-bucket-role');
  const response = await request.post(`/api/management/buckets/${bucketId}/roles`, {
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

export async function createAdminRoleFixture(
  request: APIRequestContext
): Promise<{ id: string; name: string }> {
  const name = nextFixtureName('e2e-admin-role');
  const response = await request.post('/api/management/admin-roles', {
    data: {
      name,
      adminsCrud: 2,
      usersCrud: 2,
      bucketsCrud: 2,
      bucketMessagesCrud: 2,
      bucketAdminsCrud: 2,
      eventVisibility: 'all_admins',
    },
  });
  if (!response.ok()) {
    throw new Error(
      `Failed to create admin role fixture: ${response.status()} ${response.statusText()}`
    );
  }
  const data = (await response.json()) as { role?: { id: string; name?: string } };
  const role = data.role;
  if (role === undefined || typeof role.id !== 'string') {
    throw new Error('Admin role fixture response missing role id');
  }
  return { id: role.id, name: typeof role.name === 'string' ? role.name : name };
}
