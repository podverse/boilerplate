'use client';

import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { ButtonLink } from '../../form/ButtonLink/ButtonLink';
import { CrudButtons } from '../../form/CrudButtons/CrudButtons';
import { Container } from '../../layout/Container/Container';
import { DataDetail } from '../../layout/DataDetail/DataDetail';
import { Stack } from '../../layout/Stack/Stack';
import type { DataDetailItem } from '../../layout/DataDetail/DataDetail';
import { PageHeader } from '../../layout/PageHeader/PageHeader';
import { Link } from '../../navigation/Link/Link';
import { Row } from '../../layout/Row/Row';
import { SectionWithHeading } from '../../layout/SectionWithHeading/SectionWithHeading';
import { Table } from '../../table/Table/Table';
import { TableWithSort } from '../../table/TableWithSort';
import type { TableWithSortColumn } from '../../table/TableWithSort';

import styles from './BucketDetailContent.module.scss';

const DEFAULT_TOPICS_SORT_BY = 'name';
const DEFAULT_TOPICS_SORT_ORDER = 'asc' as const;

export type BucketTopic = {
  id: string;
  name: string;
  href: string;
  /** Optional edit URL for this topic. When set, edit button is shown (avoids passing a function from Server Components). */
  editHref?: string;
  /** Formatted date string for the Created column. */
  createdAtDisplay: string;
  /** Formatted date string for the Last Message column; when null/undefined show "—". */
  lastMessageAtDisplay?: string | null;
  /** Display value for the Public column (e.g. "Yes" / "No"). When undefined, show "—". */
  isPublicDisplay?: ReactNode;
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
  /** Column header for Name. Default: "Name". */
  topicsColumnName?: ReactNode;
  /** Column header for Last Message. Default: "Last Message". */
  topicsColumnLastMessage?: ReactNode;
  /** Column header for Created. Default: "Created". */
  topicsColumnCreated?: ReactNode;
  /** Column header for Public. Default: "Public". */
  topicsColumnPublic?: ReactNode;
  /** Column header for Actions. Default: "Actions". */
  topicsColumnActions?: ReactNode;
  /** Empty state message when there are no items in the list. Default: "No buckets yet." */
  topicsEmptyMessage?: ReactNode;
  /** When set with topicsSortOrder and topicsSortBasePath, the topics table has sortable Name, Last Message, Created columns. */
  topicsSortBy?: string;
  /** Current sort order for the topics table (used with topicsSortBy and topicsSortBasePath). */
  topicsSortOrder?: 'asc' | 'desc';
  /** Base URL for the buckets tab (e.g. bucketDetailTabRoute(id, 'buckets')). Used with topicsSortBy/topicsSortOrder for sort navigation. */
  topicsSortBasePath?: string;
  /** When set, topics table sort is persisted in this cookie (path key bucket-detail-topics) and restored when URL has no sortBy/sortOrder. */
  topicsSortPrefsCookieName?: string;
  /** When false, do not wrap content in Container (e.g. when the page already wraps in Container). Default: true. */
  wrapInContainer?: boolean;
  /** When provided, render this instead of the default action buttons (Messages, Public, Settings). Use for tabbed layout. */
  actionArea?: ReactNode;
  /** When provided, render below action area and above topics. Use for Messages tab content. */
  messagesSlot?: ReactNode;
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
  topicsColumnName = 'Name',
  topicsColumnLastMessage = 'Last Message',
  topicsColumnCreated = 'Created',
  topicsColumnPublic = 'Public',
  topicsColumnActions = 'Actions',
  topicsEmptyMessage = 'No buckets yet.',
  topicsSortBy,
  topicsSortOrder,
  topicsSortBasePath,
  topicsSortPrefsCookieName,
  wrapInContainer = true,
  actionArea,
  messagesSlot,
}: BucketDetailContentProps) {
  const router = useRouter();
  const topicsSortEnabled =
    topicsSortBy !== undefined &&
    topicsSortOrder !== undefined &&
    topicsSortBasePath !== undefined &&
    topicsSortBasePath !== '';

  const topicsColumns: TableWithSortColumn[] = useMemo(() => {
    const cols: TableWithSortColumn[] = [
      {
        id: 'name',
        label: topicsColumnName,
        sortable: true,
        sortKey: 'name',
        defaultSortOrder: 'asc',
        sortLabel: typeof topicsColumnName === 'string' ? topicsColumnName : 'Name',
      },
      {
        id: 'lastMessage',
        label: topicsColumnLastMessage,
        sortable: true,
        sortKey: 'lastMessage',
        defaultSortOrder: 'desc',
        sortLabel:
          typeof topicsColumnLastMessage === 'string' ? topicsColumnLastMessage : 'Last Message',
      },
      {
        id: 'created',
        label: topicsColumnCreated,
        sortable: true,
        sortKey: 'created',
        defaultSortOrder: 'desc',
        sortLabel: typeof topicsColumnCreated === 'string' ? topicsColumnCreated : 'Created',
      },
      { id: 'public', label: topicsColumnPublic, sortable: false },
      { id: 'actions', label: topicsColumnActions, sortable: false },
    ];
    return cols;
  }, [
    topicsColumnName,
    topicsColumnLastMessage,
    topicsColumnCreated,
    topicsColumnPublic,
    topicsColumnActions,
  ]);

  const buildTopicsSortUrl = useCallback(
    (sortByKey: string, sortOrderValue: 'asc' | 'desc'): string => {
      if (!topicsSortBasePath) return '';
      const parts = topicsSortBasePath.includes('?')
        ? topicsSortBasePath.split('?', 2)
        : [topicsSortBasePath, ''];
      const path = parts[0] ?? topicsSortBasePath;
      const queryString = parts[1] ?? '';
      const params = new URLSearchParams(queryString);
      if (sortByKey === DEFAULT_TOPICS_SORT_BY && sortOrderValue === DEFAULT_TOPICS_SORT_ORDER) {
        params.delete('sortBy');
        params.delete('sortOrder');
      } else {
        params.set('sortBy', sortByKey);
        params.set('sortOrder', sortOrderValue);
      }
      const search = params.toString();
      return search !== '' ? `${path}?${search}` : path;
    },
    [topicsSortBasePath]
  );

  const handleTopicsSortChange = useCallback(
    (sortKey: string, nextOrder: 'asc' | 'desc') => {
      if (!topicsSortBasePath) return;
      const url = buildTopicsSortUrl(sortKey, nextOrder);
      if (url !== '') router.push(url);
    },
    [topicsSortBasePath, buildTopicsSortUrl, router]
  );

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
  const content = (
    <>
      <PageHeader title={bucketName} />
      <DataDetail items={detailItems} />
      {actionArea !== undefined ? (
        actionArea
      ) : (
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
      )}
      {messagesSlot !== undefined ? <Stack maxWidth="readable">{messagesSlot}</Stack> : null}
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
          <Table.ScrollContainer>
            {topicsSortEnabled ? (
              <TableWithSort
                className={styles.topicsTable}
                columns={topicsColumns}
                sortBy={topicsSortBy}
                sortOrder={topicsSortOrder}
                onSortChange={handleTopicsSortChange}
                sortPrefsCookieName={
                  topicsSortPrefsCookieName !== undefined && topicsSortPrefsCookieName.trim() !== ''
                    ? topicsSortPrefsCookieName
                    : undefined
                }
                sortPrefsListKey={
                  topicsSortPrefsCookieName !== undefined && topicsSortPrefsCookieName.trim() !== ''
                    ? 'bucket-detail-topics'
                    : undefined
                }
                getSortUrl={
                  topicsSortPrefsCookieName !== undefined && topicsSortPrefsCookieName.trim() !== ''
                    ? buildTopicsSortUrl
                    : undefined
                }
                defaultSortBy={
                  topicsSortPrefsCookieName !== undefined && topicsSortPrefsCookieName.trim() !== ''
                    ? DEFAULT_TOPICS_SORT_BY
                    : undefined
                }
                defaultSortOrder={
                  topicsSortPrefsCookieName !== undefined && topicsSortPrefsCookieName.trim() !== ''
                    ? DEFAULT_TOPICS_SORT_ORDER
                    : undefined
                }
              >
                <Table.Body>
                  {topics.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>{topicsEmptyMessage}</Table.Cell>
                    </Table.Row>
                  ) : (
                    topics.map((topic) => (
                      <Table.Row key={topic.id}>
                        <Table.Cell>
                          <Link href={topic.href} className={styles.nameCellLink} tabIndex={0}>
                            {topic.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {topic.lastMessageAtDisplay !== undefined &&
                          topic.lastMessageAtDisplay !== null &&
                          topic.lastMessageAtDisplay !== ''
                            ? topic.lastMessageAtDisplay
                            : '—'}
                        </Table.Cell>
                        <Table.Cell>{topic.createdAtDisplay}</Table.Cell>
                        <Table.Cell>
                          {topic.isPublicDisplay !== undefined && topic.isPublicDisplay !== null
                            ? topic.isPublicDisplay
                            : '—'}
                        </Table.Cell>
                        <Table.Cell>
                          <div className={styles.actionsCell}>{getTopicActions(topic)}</div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </TableWithSort>
            ) : (
              <Table className={styles.topicsTable}>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{topicsColumnName}</Table.HeaderCell>
                    <Table.HeaderCell>{topicsColumnLastMessage}</Table.HeaderCell>
                    <Table.HeaderCell>{topicsColumnCreated}</Table.HeaderCell>
                    <Table.HeaderCell>{topicsColumnPublic}</Table.HeaderCell>
                    <Table.HeaderCell>{topicsColumnActions}</Table.HeaderCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {topics.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>{topicsEmptyMessage}</Table.Cell>
                    </Table.Row>
                  ) : (
                    topics.map((topic) => (
                      <Table.Row key={topic.id}>
                        <Table.Cell>
                          <Link href={topic.href} className={styles.nameCellLink} tabIndex={0}>
                            {topic.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {topic.lastMessageAtDisplay !== undefined &&
                          topic.lastMessageAtDisplay !== null &&
                          topic.lastMessageAtDisplay !== ''
                            ? topic.lastMessageAtDisplay
                            : '—'}
                        </Table.Cell>
                        <Table.Cell>{topic.createdAtDisplay}</Table.Cell>
                        <Table.Cell>
                          {topic.isPublicDisplay !== undefined && topic.isPublicDisplay !== null
                            ? topic.isPublicDisplay
                            : '—'}
                        </Table.Cell>
                        <Table.Cell>
                          <div className={styles.actionsCell}>{getTopicActions(topic)}</div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            )}
          </Table.ScrollContainer>
        </SectionWithHeading>
      )}
    </>
  );
  return wrapInContainer ? <Container>{content}</Container> : content;
}
