import { redirect } from 'next/navigation';

import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES, bucketViewRoute } from '../../../../../lib/routes';

/**
 * Standalone messages route redirects to bucket detail (Messages tab).
 */
export default async function BucketMessagesRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id } = await params;
  redirect(bucketViewRoute(id));
}
