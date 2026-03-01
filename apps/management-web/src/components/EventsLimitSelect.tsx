'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DEFAULT_PAGE_LIMIT_OPTIONS } from '@boilerplate/helpers';
import { Select } from '@boilerplate/ui';

import { ROUTES } from '../lib/routes';

function limitOptions(currentLimit: number): { value: string; label: string }[] {
  const current = String(currentLimit);
  const hasCurrent = DEFAULT_PAGE_LIMIT_OPTIONS.some((o) => o.value === current);
  if (hasCurrent) return [...DEFAULT_PAGE_LIMIT_OPTIONS];
  return [...DEFAULT_PAGE_LIMIT_OPTIONS, { value: current, label: current }].sort(
    (a, b) => Number(a.value) - Number(b.value)
  );
}

function buildEventsUrl(params: {
  sort: string;
  limit: number;
  defaultLimit: number;
  page?: number;
}): string {
  const search = new URLSearchParams();
  if (params.sort !== 'recent') search.set('sort', params.sort);
  if (params.limit !== params.defaultLimit) search.set('limit', String(params.limit));
  if (params.page !== undefined && params.page > 1) search.set('page', String(params.page));
  const q = search.toString();
  return q ? `${ROUTES.EVENTS}?${q}` : ROUTES.EVENTS;
}

export type EventsLimitSelectProps = {
  sort: string;
  limit: number;
  defaultLimit: number;
  label?: string;
};

export function EventsLimitSelect({
  sort,
  limit,
  defaultLimit,
  label,
}: EventsLimitSelectProps) {
  const t = useTranslations('common');
  const effectiveLabel = label ?? t('eventsLimit.label');

  const router = useRouter();
  const value = String(limit);

  const handleChange = (newValue: string) => {
    const newLimit = Math.max(1, Number(newValue) || defaultLimit);
    const url = buildEventsUrl({
      sort,
      limit: newLimit,
      defaultLimit,
      page: 1,
    });
    router.push(url);
  };

  return (
    <Select
      label={effectiveLabel}
      options={limitOptions(limit)}
      value={value}
      onChange={handleChange}
      aria-label={effectiveLabel}
    />
  );
}
