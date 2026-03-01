'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { GoToPageModal, type GoToPageModalProps } from './GoToPageModal';

import styles from './Pagination.module.scss';

export type PaginationProps = {
  /** Current 1-based page. */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Base path for links (e.g. /admins or /events). No trailing slash. */
  basePath: string;
  /** Current page size. Used to build URL when not equal to defaultLimit. */
  limit: number;
  /** Default page size; when limit equals this, limit is omitted from URL. */
  defaultLimit: number;
  /** Optional query params to include in every pagination URL (e.g. sort=oldest). */
  queryParams?: Record<string, string>;
  /** When set, go-to-page modal only allows 1..maxGoToPage and shows e.g. "Pages 1 to 500 of 500+". Next/Prev still use real totalPages. */
  maxGoToPage?: number;
  /** Optional labels for the bar and modal. */
  labels?: {
    previous?: string;
    next?: string;
    goToPage?: string;
    goToPageModal?: GoToPageModalProps['labels'];
  };
};

function buildPageUrl(
  basePath: string,
  page: number,
  limit: number,
  defaultLimit: number,
  queryParams?: Record<string, string>
): string {
  const params = new URLSearchParams();
  if (queryParams !== undefined) {
    for (const [k, v] of Object.entries(queryParams)) {
      if (v !== undefined && v !== '') params.set(k, v);
    }
  }
  if (page > 1) params.set('page', String(page));
  if (limit !== defaultLimit) params.set('limit', String(limit));
  const q = params.toString();
  return q ? `${basePath}?${q}` : basePath;
}

const MAX_VISIBLE_PAGES = 7;

function pageRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const result: (number | 'ellipsis')[] = [];
  const showLeft = current > 2;
  const showRight = current < total - 1;
  if (showLeft) {
    result.push(1);
    if (current > 3) result.push('ellipsis');
  }
  const start = showLeft ? Math.max(2, current - 1) : 1;
  const end = showRight ? Math.min(total - 1, current + 1) : total;
  for (let p = start; p <= end; p += 1) result.push(p);
  if (showRight) {
    if (current < total - 2) result.push('ellipsis');
    result.push(total);
  }
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  limit,
  defaultLimit,
  queryParams,
  maxGoToPage,
  labels = {},
}: PaginationProps) {
  const t = useTranslations('ui.pagination');
  const [goToPageOpen, setGoToPageOpen] = useState(false);
  const previous = labels.previous ?? t('previous');
  const next = labels.next ?? t('next');
  const goToPage = labels.goToPage ?? t('goToPage');

  const effectiveGoToTotalPages =
    maxGoToPage !== undefined && totalPages > maxGoToPage ? maxGoToPage : totalPages;
  const goToPageModalLabels =
    maxGoToPage !== undefined && totalPages > maxGoToPage
      ? {
          ...labels.goToPageModal,
          rangeText: t('pagesRangeOf', { max: effectiveGoToTotalPages }),
        }
      : labels.goToPageModal;

  const getPageUrl = (page: number) =>
    buildPageUrl(basePath, page, limit, defaultLimit, queryParams);

  const pages = useMemo(() => pageRange(currentPage, totalPages), [currentPage, totalPages]);

  const handleGoToPage = (page: number) => {
    const url = getPageUrl(page);
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  if (totalPages < 1) return null;

  return (
    <>
      <nav className={styles.bar} aria-label={t('ariaPagination')}>
        <div className={styles.controls}>
          {currentPage > 1 ? (
            <a
              href={getPageUrl(currentPage - 1)}
              className={styles.link}
              aria-label={t('ariaPreviousPage')}
            >
              {previous}
            </a>
          ) : (
            <span className={styles.linkDisabled} aria-disabled="true">
              {previous}
            </span>
          )}
          <span className={styles.pageList}>
            {pages.map((p, i) =>
              p === 'ellipsis' ? (
                <span key={`e-${i}`} className={styles.ellipsis}>
                  …
                </span>
              ) : p === currentPage ? (
                <span key={p} className={styles.pageCurrent} aria-current="page">
                  {p}
                </span>
              ) : (
                <a key={p} href={getPageUrl(p)} className={styles.link}>
                  {p}
                </a>
              )
            )}
          </span>
          {currentPage < totalPages ? (
            <a
              href={getPageUrl(currentPage + 1)}
              className={styles.link}
              aria-label={t('ariaNextPage')}
            >
              {next}
            </a>
          ) : (
            <span className={styles.linkDisabled} aria-disabled="true">
              {next}
            </span>
          )}
        </div>
        <div className={styles.goToPageWrap}>
          <button
            type="button"
            className={styles.goToPageButton}
            onClick={() => setGoToPageOpen(true)}
          >
            {goToPage}
          </button>
        </div>
      </nav>
      <GoToPageModal
        open={goToPageOpen}
        totalPages={effectiveGoToTotalPages}
        currentPage={currentPage}
        onGo={handleGoToPage}
        onClose={() => setGoToPageOpen(false)}
        labels={goToPageModalLabels}
      />
    </>
  );
}
