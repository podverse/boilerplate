import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { ResourcePageCard } from '../../../../../components/ResourcePageCard';
import { UserForm } from '../../../../../components/users/UserForm';
import type { UserFormInitialValues } from '../../../../../components/users/UserForm';
import { getServerUser } from '../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../config/env';
import { getCrudFlags } from '../../../../../lib/main-nav';
import { ROUTES } from '../../../../../lib/routes';
import { getCookieHeader } from '../../../../../lib/server-request';
import type { MainAppUser } from '../../../../../types/management-api';

type EditUserPageProps = {
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

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const crud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'usersCrud');
  if (!crud.update) {
    redirect(ROUTES.USERS);
  }

  const { id } = await params;
  const result = await fetchUser(id);
  if (result === null) {
    notFound();
  }

  const mainUser = result.user;
  const initialValues: UserFormInitialValues = {
    email: mainUser.email,
    displayName: mainUser.displayName ?? '',
  };

  const tCommon = await getTranslations('common');

  return (
    <ResourcePageCard
      title={tCommon('editUserTitle', {
        name: mainUser.displayName ?? mainUser.email,
      })}
    >
      <UserForm mode="edit" userId={id} initialValues={initialValues} />
    </ResourcePageCard>
  );
}
