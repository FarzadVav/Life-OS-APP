"use client";

import useSWR from 'swr';
import type { LifeArea } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch life areas');
  }
  const data = await res.json();
  return (data.lifeAreas || []) as LifeArea[];
};

export function useLifeAreas() {
  const { data: lifeAreas = [], error, isLoading, mutate } = useSWR<LifeArea[]>(
    '/api/life-areas',
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  const createLifeArea = async (payload: { title: string; vision: string }) => {
    const res = await fetch('/api/life-areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create life area');
    }

    const json = await res.json();
    await mutate();
    return json.lifeArea as LifeArea;
  };

  const updateLifeArea = async (
    id: number,
    payload: { title?: string; vision?: string },
  ) => {
    const res = await fetch(`/api/life-areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update life area');
    }

    const json = await res.json();
    await mutate();
    return json.lifeArea as LifeArea;
  };

  const deleteLifeArea = async (id: number) => {
    const res = await fetch(`/api/life-areas/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete life area');
    }

    await mutate();
    return true;
  };

  return {
    lifeAreas,
    isLoading,
    error,
    createLifeArea,
    updateLifeArea,
    deleteLifeArea,
    mutate,
  };
}
