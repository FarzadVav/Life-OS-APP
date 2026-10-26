"use client";

import useSWR from 'swr';
import type { Habit } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch habits');
  }
  const data = await res.json();
  return (data.habits || []) as Habit[];
};

export function useHabits(lifeAreaId?: number | null) {
  const endpoint =
    lifeAreaId !== undefined && lifeAreaId !== null
      ? `/api/habits-n-rules?lifeAreaId=${lifeAreaId}`
      : '/api/habits-n-rules';

  const { data: habits = [], error, isLoading, mutate } = useSWR<Habit[]>(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  return {
    habits,
    isLoading,
    error,
    mutate,
  };
}
