import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, Stack, Text } from '@boilerplate/ui';

import { UsersTableWithFilter } from '../../../components/UsersTableWithFilter';
import { getServerUser } from '../../../lib/server-auth';
import { getManagementApiBaseUrl } from '../../../config/env';
import { hasReadPermission } from '../../../lib/main-nav';
import { ROUTES } from '../../../lib/routes';
import type { MainAppUser } from '../../../types/management-api';

type UsersResponse = {
  users: MainAppUser[];
};

async function fetchUsers(): Promise<{ data: UsersResponse | null; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const baseUrl = getManagementApiBaseUrl();
  try {
    const res = await request(baseUrl, '/users', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { data: null, error: 'Failed to load users' };
    }

    const data = res.data as UsersResponse | undefined;
    if (data === undefined || !Array.isArray(data.users)) {
      return { data: null, error: null };
    }
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to load users' };
  }
}

type PageProps = {
  searchParams?: Promise<{
    filterColumns?: string;
    search?: string;
  }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const canReadUsers =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'usersCrud');
  if (!canReadUsers) {
    redirect(ROUTES.DASHBOARD);
  }

  const resolved = searchParams !== undefined ? await searchParams : {};
  const filterColumnsRaw = resolved.filterColumns ?? '';
  const userColumnIds = ['email', 'displayName', 'profileVisibility'];
  const initialFilterColumns =
    filterColumnsRaw.trim() === ''
      ? userColumnIds
      : filterColumnsRaw
          .split(',')
          .map((s) => s.trim())
          .filter((id) => userColumnIds.includes(id));
  const effectiveFilterColumns =
    initialFilterColumns.length > 0 ? initialFilterColumns : userColumnIds;
  const search = resolved.search ?? '';

  const tCommon = await getTranslations('common');
  const { data, error } = await fetchUsers();

  const users = data?.users ?? [];

  const usersCrud = user.permissions?.usersCrud ?? 0;
  const canCreateUser = user.isSuperAdmin === true || (usersCrud & 1) !== 0;
  const canUpdateUser = user.isSuperAdmin === true || (usersCrud & 4) !== 0;
  const canDeleteUser = user.isSuperAdmin === true || (usersCrud & 8) !== 0;
  const apiBaseUrl = getManagementApiBaseUrl();

  const tableRows = users.map((u) => ({
    id: u.id,
    cells: {
      email: u.email,
      displayName: u.displayName !== null && u.displayName !== '' ? u.displayName : '—',
      profileVisibility: u.profileVisibility
        ? tCommon('usersTable.visibilityYes')
        : tCommon('usersTable.visibilityNo'),
    },
  }));

  const userColumns = [
    { id: 'email', label: tCommon('usersTable.email') },
    { id: 'displayName', label: tCommon('usersTable.displayName') },
    { id: 'profileVisibility', label: tCommon('usersTable.profileVisibility') },
  ];

  const currentQueryParams: Record<string, string> = {};
  if (filterColumnsRaw.trim() !== '') currentQueryParams.filterColumns = filterColumnsRaw;
  if (search !== '') currentQueryParams.search = search;

  return (
    <Container>
      <Stack>
        <Card title={tCommon('users')}>
          {error !== null && (
            <Text variant="error" role="alert">
              {tCommon('failedToLoadUsers')}
            </Text>
          )}
          {error === null && (
            <Stack>
              <UsersTableWithFilter
                tableRows={tableRows}
                emptyMessage={users.length === 0 ? tCommon('noUsers') : undefined}
                columns={userColumns}
                initialFilterColumns={effectiveFilterColumns}
                initialSearch={search}
                basePath={ROUTES.USERS}
                currentQueryParams={currentQueryParams}
                canUpdateUser={canUpdateUser}
                canDeleteUser={canDeleteUser}
                userApiBaseUrl={apiBaseUrl}
                addUserHref={canCreateUser ? ROUTES.USERS_NEW : undefined}
              />
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
