import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs, Container, Link, SectionWithHeading } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { fetchBucket } from '../../../../../../lib/buckets';
import { getServerUser } from '../../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../../lib/routes';
import { TopicForm } from '../../../../buckets/TopicForm';

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

  const t = await getTranslations('buckets');
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: bucket.name, href: bucketDetailRoute(bucketId) },
    { label: t('createTopic'), href: undefined },
  ];

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} LinkComponent={BreadcrumbLink} ariaLabel={t('topics')} />
      <SectionWithHeading title={t('createTopic')}>
        <TopicForm
          parentBucketId={bucketId}
          successHref={bucketDetailRoute(bucketId)}
          cancelHref={bucketDetailRoute(bucketId)}
        />
      </SectionWithHeading>
    </Container>
  );
}
