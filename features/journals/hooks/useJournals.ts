'use client';

import useSWR from 'swr';
import type { Journal, JournalCategory } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch journals');
  }
  const data = await res.json();
  return (data.journals ?? []) as Journal[];
};

export function useJournals(category?: JournalCategory | 'all' | string) {
  const queryParam = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  const url = `/api/journals${queryParam}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Journal[]>(url, fetcher, {
    revalidateOnFocus: true,
  });

  const journals = data ?? [];

  /**
   * Optimistically deletes a journal entry.
   */
  const deleteJournal = async (id: number) => {
    const previousJournals = journals;
    const nextJournals = journals.filter((item) => item.id !== id);

    await mutate(nextJournals, false);

    try {
      const response = await fetch(`/api/journals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete journal');
      }
      await mutate();
    } catch (err) {
      await mutate(previousJournals, false);
      throw err;
    }
  };

  return {
    journals,
    isLoading,
    isValidating,
    error,
    mutate,
    deleteJournal,
  };
}
