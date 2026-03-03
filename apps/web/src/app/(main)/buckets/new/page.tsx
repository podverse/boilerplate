import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getServerUser } from '../../../../lib/server-auth';
import { ROUTES } from '../../../../lib/routes';
import { BucketForm } from '../BucketForm';
import { Card, Container, Stack } from '@boilerplate/ui';

export default async function NewBucketPage() {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const t = await getTranslations('buckets');
  return (
    <Container>
      <Stack>
        <Card title={t('newTitle')}>
          <BucketForm
            mode="create"
            bucket={null}
            successHref={ROUTES.BUCKETS}
            cancelHref={ROUTES.BUCKETS}
          />
        </Card>
      </Stack>
    </Container>
  );
}
