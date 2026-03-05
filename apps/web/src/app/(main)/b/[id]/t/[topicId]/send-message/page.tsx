import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import { Breadcrumbs, Container, Link, SectionWithHeading } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { getServerApiBaseUrl } from '../../../../../../../lib/server-request';
import { publicBucketRoute, publicTopicRoute } from '../../../../../../../lib/routes';
import { PublicSubmitForm } from '../../../../PublicSubmitForm';

async function fetchPublicBucket(id: string): Promise<PublicBucket | null> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucket(baseUrl, id);
  if (!res.ok || res.data === undefined) return null;
  const bucket = res.data.bucket;
  return bucket !== undefined && typeof bucket?.id === 'string' ? bucket : null;
}

function BreadcrumbLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function PublicTopicSendMessagePage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id: parentId, topicId } = await params;
  const parent = await fetchPublicBucket(parentId);
  const topic = await fetchPublicBucket(topicId);
  if (parent === null || topic === null || topic.parentBucketId !== parent.id) {
    notFound();
  }

  const t = await getTranslations('buckets');
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: parent.name, href: publicBucketRoute(parentId) },
    { label: topic.name, href: publicTopicRoute(parentId, topicId) },
    { label: t('sendMessage'), href: undefined },
  ];

  return (
    <Container>
      <Breadcrumbs
        items={breadcrumbItems}
        LinkComponent={BreadcrumbLink}
        ariaLabel={t('sendMessage')}
      />
      <SectionWithHeading title={`${t('messages')} – ${topic.name}`}>
        <PublicSubmitForm
          bucketId={topicId}
          messageBodyMaxLength={topic.messageBodyMaxLength ?? null}
          successHref={publicTopicRoute(parentId, topicId)}
        />
      </SectionWithHeading>
    </Container>
  );
}
