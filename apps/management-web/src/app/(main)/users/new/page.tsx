import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, Container, Stack } from '@boilerplate/ui';

import { UserForm } from '../../../../components/users/UserForm';
import { getServerUser } from '../../../../lib/server-auth';
import { ROUTES } from '../../../../lib/routes';

export default async function NewUserPage() {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const canCreateUser =
    user.isSuperAdmin === true || ((user.permissions?.usersCrud ?? 0) & 1) !== 0;
  if (!canCreateUser) {
    redirect(ROUTES.USERS);
  }

  const tCommon = await getTranslations('common');

  return (
    <Container>
      <Stack>
        <Card title={tCommon('addUserTitle')}>
          <UserForm mode="create" />
        </Card>
      </Stack>
    </Container>
  );
}
