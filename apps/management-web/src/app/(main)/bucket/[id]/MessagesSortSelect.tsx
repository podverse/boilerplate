'use client';

import { useRouter } from 'next/navigation';
import { Select } from '@boilerplate/ui';

function buildMessagesUrl(params: {
  basePath: string;
  sort: string;
  queryParams?: Record<string, string>;
}): string {
  const search = new URLSearchParams();
  if (params.queryParams !== undefined) {
    for (const [k, v] of Object.entries(params.queryParams)) {
      if (v !== undefined && v !== '') search.set(k, v);
    }
  }
  if (params.sort !== 'recent') search.set('sort', params.sort);
  search.set('page', '1');
  const q = search.toString();
  return q !== '' ? `${params.basePath}?${q}` : params.basePath;
}

export type MessagesSortSelectProps = {
  sort: string;
  basePath: string;
  queryParams?: Record<string, string>;
  label: string;
  sortOptionLabels: { recent: string; oldest: string };
};

export function MessagesSortSelect({
  sort,
  basePath,
  queryParams,
  label,
  sortOptionLabels,
}: MessagesSortSelectProps) {
  const router = useRouter();
  const value = sort === 'oldest' ? 'oldest' : 'recent';
  const options = [
    { value: 'recent', label: sortOptionLabels.recent },
    { value: 'oldest', label: sortOptionLabels.oldest },
  ];

  const handleChange = (newValue: string) => {
    const url = buildMessagesUrl({
      basePath,
      sort: newValue,
      queryParams,
    });
    router.push(url);
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      aria-label={label}
      sizeToSelected
      variant="tabTransparent"
    />
  );
}
