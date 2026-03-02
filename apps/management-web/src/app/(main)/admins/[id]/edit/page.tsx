import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, Stack } from '@boilerplate/ui';

import { AdminForm } from '../../../../../components/admins/AdminForm';
import type { AdminFormInitialValues } from '../../../../../components/admins/AdminForm';
import { getServerUser } from '../../../../../lib/server-auth';
import { getManagementApiBaseUrl } from '../../../../../config/env';
import { ROUTES } from '../../../../../lib/routes';
import type { ManagementUser } from '../../../../../types/management-api';

type EditAdminPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchAdmin(id: string): Promise<{ admin: ManagementUser } | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const baseUrl = getManagementApiBaseUrl();
  try {
    const res = await request(baseUrl, `/admins/${id}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok || res.data === undefined) return null;
    const data = res.data as { admin?: ManagementUser };
    if (data.admin === undefined) return null;
    return { admin: data.admin };
  } catch {
    return null;
  }
}

export default async function EditAdminPage({ params }: EditAdminPageProps) {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  if (!user.isSuperAdmin) {
    redirect(ROUTES.ADMINS);
  }

  const { id } = await params;
  const result = await fetchAdmin(id);
  if (result === null) {
    notFound();
  }

  const admin = result.admin;
  const initialValues: AdminFormInitialValues = {
    displayName: admin.displayName ?? '',
    email: admin.email,
    permissions: admin.permissions ?? null,
  };

  const tCommon = await getTranslations('common');

  return (
    <Container>
      <Stack>
        <Card title={tCommon('editAdminTitle', { name: admin.displayName ?? admin.email })}>
          <AdminForm
            mode="edit"
            adminId={id}
            initialValues={initialValues}
            isSuperAdmin={user.isSuperAdmin}
          />
        </Card>
      </Stack>
    </Container>
  );
}
