"use client";

import useSWR from 'swr';
import type { Skill } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch skills');
  }
  const data = await res.json();
  return (data.skills || []) as Skill[];
};

export function useSkills(lifeAreaId?: number | null) {
  const endpoint = lifeAreaId ? `/api/skills?lifeAreaId=${lifeAreaId}` : '/api/skills';

  const { data: skills = [], error, isLoading, mutate } = useSWR<Skill[]>(
    endpoint,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  const createSkill = async (payload: {
    title: string;
    content: string;
    lifeAreaId?: number | null;
  }) => {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create skill');
    }

    const json = await res.json();
    await mutate();
    return json.skill as Skill;
  };

  const updateSkill = async (
    id: number,
    payload: { title?: string; content?: string; lifeAreaId?: number | null },
  ) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update skill');
    }

    const json = await res.json();
    await mutate();
    return json.skill as Skill;
  };

  const deleteSkill = async (id: number) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete skill');
    }

    await mutate();
    return true;
  };

  return {
    skills,
    isLoading,
    error,
    createSkill,
    updateSkill,
    deleteSkill,
    mutate,
  };
}
