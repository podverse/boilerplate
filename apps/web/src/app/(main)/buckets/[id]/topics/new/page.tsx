import { redirect, notFound } from 'next/navigation';
import { Container, Stack } from '@boilerplate/ui';

import { fetchBucket } from '../../../../../../lib/buckets';
import { getServerUser } from '../../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../../lib/routes';
import { TopicForm } from '../../../TopicForm';

export default async function NewTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const { id: bucketId } = await params;
  const { bucket } = await fetchBucket(bucketId);
  if (bucket === null || bucket.parentBucketId !== null) {
    notFound();
  }

  return (
    <Container>
      <Stack>
        <TopicForm
          parentBucketId={bucketId}
          successHref={bucketDetailRoute(bucketId)}
          cancelHref={bucketDetailRoute(bucketId)}
        />
      </Stack>
    </Container>
  );
}
