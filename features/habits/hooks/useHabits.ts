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
      ? `/api/habits?lifeAreaId=${lifeAreaId}`
      : '/api/habits';

  const { data: habits = [], error, isLoading, mutate } = useSWR<Habit[]>(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  const createHabit = async (payload: {
    title: string;
    description?: string;
    repeatInterval?: string;
    lifeAreaId?: number | null;
  }) => {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create habit');
    }

    const json = await res.json();
    await mutate();
    return json.habit as Habit;
  };

  const updateHabit = async (
    id: number,
    payload: {
      title?: string;
      description?: string;
      repeatInterval?: string;
      lifeAreaId?: number | null;
    },
  ) => {
    const res = await fetch(`/api/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update habit');
    }

    const json = await res.json();
    await mutate();
    return json.habit as Habit;
  };

  const deleteHabit = async (id: number) => {
    const res = await fetch(`/api/habits/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete habit');
    }

    await mutate();
    return true;
  };

  const recordHabit = async (id: number, isDone: boolean, date?: string) => {
    const targetDate = date || new Date().toISOString().slice(0, 10);

    // Optimistic UI update
    const previousHabits = habits;
    const updatedHabits = habits.map((h) => {
      if (h.id !== id) return h;
      const existingHistory = h.history || [];
      const index = existingHistory.findIndex((entry) => entry.date === targetDate);
      let nextHistory;
      if (index >= 0) {
        nextHistory = existingHistory.map((entry, i) =>
          i === index ? { ...entry, isDone } : entry,
        );
      } else {
        nextHistory = [
          ...existingHistory,
          { id: Date.now(), date: targetDate, isDone },
        ];
      }
      return { ...h, history: nextHistory };
    });

    mutate(updatedHabits, false);

    try {
      const res = await fetch(`/api/habits/${id}/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone, date: targetDate }),
      });

      if (!res.ok) {
        throw new Error('Failed to record habit');
      }

      await mutate();
      return true;
    } catch (err) {
      mutate(previousHabits, false);
      throw err;
    }
  };

  return {
    habits,
    isLoading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    recordHabit,
    mutate,
  };
}
