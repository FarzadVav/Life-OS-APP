'use client';

import useSWR from 'swr';
import type { FrameworkStats } from '../queries';

const statsFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch framework stats');
  }
  const data = await res.json();
  return (data.stats ?? null) as FrameworkStats | null;
};

export function useFrameworkStats() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<FrameworkStats | null>(
    '/api/framework/stats',
    statsFetcher,
    {
      revalidateOnFocus: true,
    },
  );

  return {
    stats: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
