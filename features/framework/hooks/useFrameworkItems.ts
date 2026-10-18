'use client';

import useSWR from 'swr';
import type { FrameworkItem, FrameworkCategory, FrameworkSection } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch framework items');
  }
  const data = await res.json();
  return (data.items ?? []) as FrameworkItem[];
};

export function useFrameworkItems(
  category?: FrameworkCategory | 'all' | string,
  section?: FrameworkSection | 'all' | string,
) {
  const params = new URLSearchParams();
  if (category && category !== 'all') {
    params.set('category', category);
  }
  if (section && section !== 'all') {
    params.set('section', section);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const url = `/api/framework${query}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<FrameworkItem[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: true,
    },
  );

  const items = data ?? [];

  /**
   * Optimistically deletes a framework item.
   */
  const deleteItem = async (id: number) => {
    const previousItems = items;
    const nextItems = items.filter((item) => item.id !== id);

    await mutate(nextItems, false);

    try {
      const response = await fetch(`/api/framework/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete framework item');
      }
      await mutate();
    } catch (err) {
      await mutate(previousItems, false);
      throw err;
    }
  };

  return {
    items,
    isLoading,
    isValidating,
    error,
    mutate,
    deleteItem,
  };
}
