import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, Stack } from '@boilerplate/ui';

import { UserForm } from '../../../../../components/users/UserForm';
import type { UserFormInitialValues } from '../../../../../components/users/UserForm';
import { getServerUser } from '../../../../../lib/server-auth';
import { getManagementApiBaseUrl } from '../../../../../config/env';
import { ROUTES } from '../../../../../lib/routes';
import type { MainAppUser } from '../../../../../types/management-api';

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchUser(id: string): Promise<{ user: MainAppUser } | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const baseUrl = getManagementApiBaseUrl();
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

  const canUpdateUser =
    user.isSuperAdmin === true || ((user.permissions?.usersCrud ?? 0) & 4) !== 0;
  if (!canUpdateUser) {
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
    profileVisibility: mainUser.profileVisibility,
  };

  const tCommon = await getTranslations('common');

  return (
    <Container>
      <Stack>
        <Card
          title={tCommon('editUserTitle', {
            name: mainUser.displayName ?? mainUser.email,
          })}
        >
          <UserForm mode="edit" userId={id} initialValues={initialValues} />
        </Card>
      </Stack>
    </Container>
  );
}
