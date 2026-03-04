import { notFound } from 'next/navigation';

import { fetchAdmins, fetchBucket, fetchPendingInvitations } from '../../../../../../lib/buckets';
import { BucketAdminsClient } from '../../BucketAdminsClient';

export default async function BucketSettingsAdminsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { bucket } = await fetchBucket(id);
  if (bucket === null) {
    notFound();
  }

  const [admins, pendingInvitations] = await Promise.all([
    fetchAdmins(id),
    fetchPendingInvitations(id),
  ]);

  return (
    <BucketAdminsClient
      bucketId={id}
      ownerId={bucket.ownerId}
      initialAdmins={admins}
      initialPendingInvitations={pendingInvitations}
    />
  );
}
