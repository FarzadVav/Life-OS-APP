'use client';

import useSWR from 'swr';
import type { FrameworkItem } from '../types';

const itemFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch framework item');
  }
  const data = await res.json();
  return (data.item ?? null) as FrameworkItem | null;
};

export function useFrameworkItem(id: number | null | undefined) {
  const url = id ? `/api/framework/${id}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<FrameworkItem | null>(
    url,
    itemFetcher,
    {
      revalidateOnFocus: true,
    },
  );

  return {
    item: data,
    isLoading: Boolean(id) && isLoading,
    isValidating,
    error,
    mutate,
  };
}
