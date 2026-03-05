import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { ButtonLink, Stack, Text } from '@boilerplate/ui';

import { ResourcePageCard } from '../../../../components/ResourcePageCard';

import { getServerUser } from '../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../config/env';
import { getCrudFlags, hasReadPermission } from '../../../../lib/main-nav';
import { ROUTES, userEditRoute } from '../../../../lib/routes';
import { getCookieHeader } from '../../../../lib/server-request';
import type { MainAppUser } from '../../../../types/management-api';

type ViewUserPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchUser(id: string): Promise<{ user: MainAppUser } | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  try {
    const res = await request(baseUrl, `/users/${id}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok || res.data === undefined) return null;
    const data = res.data as { user?: MainAppUser };
    if (data.user === undefined) return null;
    return { user: data.user };
  } catch {
    return null;
  }
}

export default async function ViewUserPage({ params }: ViewUserPageProps) {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const canReadUsers =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'usersCrud');
  if (!canReadUsers) {
    redirect(ROUTES.USERS);
  }

  const { id } = await params;
  const result = await fetchUser(id);
  if (result === null) {
    notFound();
  }

  const mainUser = result.user;
  const crud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'usersCrud');

  const tCommon = await getTranslations('common');

  return (
    <ResourcePageCard
      title={tCommon('viewUserTitle', { name: mainUser.displayName ?? mainUser.email })}
    >
      <Stack>
        <Text>
          <strong>{tCommon('usersTable.email')}:</strong> {mainUser.email}
        </Text>
        <Text>
          <strong>{tCommon('usersTable.displayName')}:</strong> {mainUser.displayName ?? '—'}
        </Text>
        <Stack>
          {crud.update && (
            <ButtonLink href={userEditRoute(id)} variant="primary">
              {tCommon('usersTable.edit')}
            </ButtonLink>
          )}
          <ButtonLink href={ROUTES.USERS} variant="secondary">
            {tCommon('adminForm.cancel')}
          </ButtonLink>
        </Stack>
      </Stack>
    </ResourcePageCard>
  );
}
