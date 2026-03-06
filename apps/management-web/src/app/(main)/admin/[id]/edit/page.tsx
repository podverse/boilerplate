import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { AdminForm } from '../../../../../components/admins/AdminForm';
import { ResourcePageCard } from '../../../../../components/ResourcePageCard';
import type { AdminFormInitialValues } from '../../../../../components/admins/AdminForm';
import { getServerUser } from '../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../config/env';
import { getCrudFlags } from '../../../../../lib/main-nav';
import { ROUTES } from '../../../../../lib/routes';
import { getCookieHeader } from '../../../../../lib/server-request';
import type { ManagementUser } from '../../../../../types/management-api';

type EditAdminPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchAdmin(id: string): Promise<{ admin: ManagementUser } | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
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

  const { id } = await params;
  const result = await fetchAdmin(id);
  if (result === null) {
    notFound();
  }

  const admin = result.admin;
  const crud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'adminsCrud');
  const canAccessEdit = crud.update || (admin.isSuperAdmin === true && user.id === id);
  if (!canAccessEdit) {
    redirect(ROUTES.ADMINS);
  }
  const initialValues: AdminFormInitialValues = {
    displayName: admin.displayName ?? '',
    username: admin.username,
    permissions: admin.permissions ?? null,
  };

  const canEditPermissions = crud.create || crud.update;

  const tCommon = await getTranslations('common');

  return (
    <ResourcePageCard
      title={tCommon('editAdminTitle', { name: admin.displayName ?? admin.username })}
    >
      <AdminForm
        mode="edit"
        adminId={id}
        initialValues={initialValues}
        canEditPermissions={canEditPermissions}
        targetIsSuperAdmin={admin.isSuperAdmin}
      />
    </ResourcePageCard>
  );
}
