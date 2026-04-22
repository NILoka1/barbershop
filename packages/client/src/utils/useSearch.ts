// src/hooks/useSearch.ts
import { useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';

export function useSearch<T>(
  items: T[] | undefined,
  filterFn: (items: T[], query: string) => T[]
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const filtered = useMemo(
    () => filterFn(items ?? [], debouncedQuery),
    [items, debouncedQuery, filterFn]
  );

  return { query, setQuery, filtered };
}