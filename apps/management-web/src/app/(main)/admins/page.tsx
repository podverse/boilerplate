import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, List, Stack, Text } from '@boilerplate/ui';

import { getServerUser } from '../../../lib/server-auth';
import { getManagementApiBaseUrl } from '../../../config/env';
import { ROUTES } from '../../../lib/routes';
import type { ManagementUser } from '../../../types/management-api';

async function fetchAdmins(): Promise<{ admins: ManagementUser[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const baseUrl = getManagementApiBaseUrl();

  try {
    const res = await request(baseUrl, '/admins', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { admins: [], error: 'Failed to load admins' };
    }

    const data = res.data as { admins?: ManagementUser[] } | ManagementUser[] | undefined;
    if (data === undefined) {
      return { admins: [], error: null };
    }
    if (Array.isArray(data)) {
      return { admins: data, error: null };
    }
    if (data.admins !== undefined) {
      return { admins: data.admins, error: null };
    }
    return { admins: [], error: null };
  } catch {
    return { admins: [], error: 'Failed to load admins' };
  }
}

export default async function AdminsPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const tCommon = await getTranslations('common');
  const { admins, error } = await fetchAdmins();

  return (
    <Container>
      <Stack>
        <Card title={tCommon('admins')}>
          {error !== null && (
            <Text variant="error" role="alert">
              {error}
            </Text>
          )}
          {error === null && admins.length === 0 && <p>{tCommon('noAdmins')}</p>}
          {error === null && admins.length > 0 && (
            <List>
              {admins.map((a) => (
                <li key={a.id}>
                  {a.email}
                  {a.displayName !== undefined && a.displayName !== null && ` (${a.displayName})`}
                </li>
              ))}
            </List>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
