'use client';

import type { BucketSettingsTab } from '../../../../../lib/routes';
import { bucketDetailRoute } from '../../../../../lib/routes';
import { BucketForm } from '../../BucketForm';
import type { BucketForForm } from '../../BucketForm';
import { BucketAdminsClient } from '../BucketAdminsClient';
import { BucketSettingsTabs } from './BucketSettingsTabs';

type AdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  createdAt: string;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

type PendingInvitationRow = {
  id: string;
  token: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  status: string;
  expiresAt: string;
};

type BucketSettingsContentProps = {
  activeTab: BucketSettingsTab;
  bucketId: string;
  bucket: BucketForForm;
  ownerId: string;
  admins: AdminRow[];
  pendingInvitations: PendingInvitationRow[];
};

export function BucketSettingsContent({
  activeTab,
  bucketId,
  bucket,
  ownerId,
  admins,
  pendingInvitations,
}: BucketSettingsContentProps) {
  return (
    <>
      <BucketSettingsTabs bucketId={bucketId} activeTab={activeTab} />
      {activeTab === 'general' ? (
        <BucketForm
          mode="edit"
          bucket={bucket}
          successHref={bucketDetailRoute(bucketId)}
          cancelHref={bucketDetailRoute(bucketId)}
        />
      ) : (
        <BucketAdminsClient
          bucketId={bucketId}
          ownerId={ownerId}
          initialAdmins={admins}
          initialPendingInvitations={pendingInvitations}
        />
      )}
    </>
  );
}
