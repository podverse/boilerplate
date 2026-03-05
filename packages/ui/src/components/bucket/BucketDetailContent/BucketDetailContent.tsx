'use client';

import type { ReactNode } from 'react';

import { ButtonLink } from '../../form/ButtonLink/ButtonLink';
import { CrudButtons } from '../../form/CrudButtons/CrudButtons';
import { Container } from '../../layout/Container/Container';
import { DataDetail } from '../../layout/DataDetail/DataDetail';
import type { DataDetailItem } from '../../layout/DataDetail/DataDetail';
import { PageHeader } from '../../layout/PageHeader/PageHeader';
import { Link } from '../../navigation/Link/Link';
import { Row } from '../../layout/Row/Row';
import { SectionWithHeading } from '../../layout/SectionWithHeading/SectionWithHeading';
import { Text } from '../../layout/Text/Text';
import { Table } from '../../table/Table/Table';

import styles from './BucketDetailContent.module.scss';

export type BucketTopic = {
  id: string;
  name: string;
  href: string;
  /** Optional edit URL for this topic. When set, edit button is shown (avoids passing a function from Server Components). */
  editHref?: string;
};

export type BucketDetailContentProps = {
  bucketName: string;
  detailItems: DataDetailItem[];
  /** When true, show Messages button. When false, Messages tab/link is hidden (e.g. when admin has no bucket messages CRUD read). */
  showMessagesLink: boolean;
  messagesHref?: string;
  messagesLabel: ReactNode;
  showPublicLink: boolean;
  publicHref?: string;
  publicLabel: ReactNode;
  showSettingsLink: boolean;
  settingsHref?: string;
  settingsLabel: ReactNode;
  /** Topics (child buckets). When undefined or empty, topics section is not rendered. */
  topics?: BucketTopic[];
  topicsTitle?: string;
  /** When set, each topic row shows CRUD actions: view (icon) plus optional edit/delete from the props below. */
  topicViewLabel?: ReactNode;
  /** When set (client-only), each topic row gets an edit button from this function. Prefer setting editHref on each topic when calling from a Server Component. */
  topicEditHref?: (topic: BucketTopic) => string;
  /** When set, each topic row gets a delete button that calls this callback. */
  topicOnDelete?: (topic: BucketTopic) => void;
  /** Aria-label for the edit button. */
  topicEditLabel?: string;
  /** Aria-label for the delete button. */
  topicDeleteLabel?: string;
  /** Optional custom actions for each topic. When provided, overrides the built-in CrudButtons (topicViewLabel + topicEditHref + topicOnDelete). */
  renderTopicActions?: (topic: BucketTopic) => ReactNode;
  createTopicHref?: string;
  createTopicLabel?: ReactNode;
};

/**
 * Presentational bucket detail: name, detail items, action buttons (Messages, Public, Settings), optional topics.
 * Used by apps/web and apps/management-web to render the same owner-style bucket view.
 */
export function BucketDetailContent({
  bucketName,
  detailItems,
  showMessagesLink,
  messagesHref,
  messagesLabel,
  showPublicLink,
  publicHref,
  publicLabel,
  showSettingsLink,
  settingsHref,
  settingsLabel,
  topics,
  topicsTitle,
  topicViewLabel,
  topicEditHref,
  topicOnDelete,
  topicEditLabel,
  topicDeleteLabel,
  renderTopicActions,
  createTopicHref,
  createTopicLabel,
}: BucketDetailContentProps) {
  const getTopicActions = (topic: BucketTopic): ReactNode => {
    if (renderTopicActions !== undefined) return renderTopicActions(topic);
    const viewHref =
      topicViewLabel !== undefined && topicViewLabel !== null && topicViewLabel !== ''
        ? topic.href
        : undefined;
    const editHref = topic.editHref ?? topicEditHref?.(topic);
    const hasDelete = topicOnDelete !== undefined;
    const hasAny =
      (viewHref !== undefined && viewHref !== '') ||
      (editHref !== undefined && editHref !== '') ||
      hasDelete;
    if (!hasAny) return null;
    return (
      <CrudButtons
        viewHref={viewHref}
        viewLabel={typeof topicViewLabel === 'string' ? topicViewLabel : undefined}
        editHref={editHref !== undefined && editHref !== '' ? editHref : undefined}
        editLabel={topicEditLabel}
        onDelete={hasDelete ? () => topicOnDelete(topic) : undefined}
        deleteLabel={topicDeleteLabel}
      />
    );
  };
  return (
    <Container contentMaxWidth="readable">
      <PageHeader title={bucketName} />
      <DataDetail items={detailItems} />
      <Row wrap>
        {showMessagesLink && messagesHref !== undefined && (
          <ButtonLink href={messagesHref} variant="secondary">
            {messagesLabel}
          </ButtonLink>
        )}
        {showPublicLink && publicHref !== undefined && (
          <ButtonLink
            href={publicHref}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {publicLabel}
          </ButtonLink>
        )}
        {showSettingsLink && settingsHref !== undefined && (
          <ButtonLink href={settingsHref} variant="secondary">
            {settingsLabel}
          </ButtonLink>
        )}
      </Row>

      {topics !== undefined && topicsTitle !== undefined && (
        <SectionWithHeading
          title={topicsTitle}
          headingAction={
            createTopicHref !== undefined && createTopicLabel !== undefined ? (
              <ButtonLink href={createTopicHref} variant="primary">
                {createTopicLabel}
              </ButtonLink>
            ) : undefined
          }
        >
          {topics.length === 0 ? (
            <Text style={{ margin: 0 }}>No topics yet.</Text>
          ) : (
            <Table.ScrollContainer>
              <Table className={styles.topicsTable}>
                <Table.Body>
                  {topics.map((topic) => (
                    <Table.Row key={topic.id}>
                      <Table.Cell>
                        <Link href={topic.href} className={styles.nameCellLink} tabIndex={0}>
                          {topic.name}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <div className={styles.actionsCell}>{getTopicActions(topic)}</div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Table.ScrollContainer>
          )}
        </SectionWithHeading>
      )}
    </Container>
  );
}
