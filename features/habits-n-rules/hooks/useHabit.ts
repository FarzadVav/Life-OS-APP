"use client";

import useSWR from 'swr';
import type { Habit } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch habit');
  }
  const data = await res.json();
  return data.habit as Habit;
};

export function useHabit(id: number | null) {
  const { data: habit = null, error, isLoading, mutate } = useSWR<Habit | null>(
    id ? `/api/habits-n-rules/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    },
  );

  return {
    habit,
    isLoading,
    error,
    mutate,
  };
}
