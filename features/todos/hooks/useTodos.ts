'use client';

import useSWR from 'swr';
import type { Todo, TodoType } from '../types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  const data = await res.json();
  return (data.todos ?? []) as Todo[];
};

export function useTodos(type?: TodoType | 'all' | string) {
  const queryParam = type && type !== 'all' ? `?type=${encodeURIComponent(type)}` : '';
  const url = `/api/todos${queryParam}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<Todo[]>(url, fetcher, {
    revalidateOnFocus: true,
  });

  const todos = data ?? [];

  /**
   * Optimistically toggles a todo's completed state.
   */
  const toggleTodo = async (id: number) => {
    const previousTodos = todos;

    // Optimistic UI update
    const nextTodos = todos.map((item) =>
      item.id === id ? { ...item, isDone: !item.isDone } : item,
    );

    await mutate(nextTodos, false);

    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
      // Revalidate to synchronize with server state
      await mutate();
    } catch (err) {
      // Rollback on failure
      await mutate(previousTodos, false);
      throw err;
    }
  };

  /**
   * Optimistically toggles a mission action item.
   */
  const toggleMissionAction = async (todoId: number, actionId: number) => {
    const previousTodos = todos;

    const nextTodos = todos.map((todo) => {
      if (todo.id !== todoId || !todo.actions) return todo;
      const updatedActions = todo.actions.map((act) =>
        act.id === actionId ? { ...act, isDone: !act.isDone } : act,
      );
      const allDone =
        updatedActions.length > 0 && updatedActions.every((act) => act.isDone);
      return {
        ...todo,
        actions: updatedActions,
        isDone: allDone,
      };
    });

    await mutate(nextTodos, false);

    try {
      const response = await fetch(`/api/todos/actions/${actionId}/toggle`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to toggle action');
      }
      await mutate();
    } catch (err) {
      await mutate(previousTodos, false);
      throw err;
    }
  };

  /**
   * Optimistically records a discipline habit check-in.
   */
  const recordMissionDiscipline = async (
    todoId: number,
    disciplineId: number,
    isDone: boolean,
  ) => {
    const previousTodos = todos;
    const nowIso = new Date().toISOString();

    const nextTodos = todos.map((todo) => {
      if (todo.id !== todoId || !todo.disciplines) return todo;
      const updatedDisciplines = todo.disciplines.map((d) => {
        if (d.id !== disciplineId) return d;
        const newHistory = [...(d.history || []), { date: nowIso, isDone }];
        return { ...d, history: newHistory };
      });
      return { ...todo, disciplines: updatedDisciplines };
    });

    await mutate(nextTodos, false);

    try {
      const response = await fetch(`/api/todos/disciplines/${disciplineId}/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone, date: nowIso }),
      });
      if (!response.ok) {
        throw new Error('Failed to record discipline');
      }
      await mutate();
    } catch (err) {
      await mutate(previousTodos, false);
      throw err;
    }
  };

  /**
   * Optimistically deletes a todo.
   */
  const deleteTodo = async (id: number) => {
    const previousTodos = todos;
    const nextTodos = todos.filter((item) => item.id !== id);

    await mutate(nextTodos, false);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      await mutate();
    } catch (err) {
      await mutate(previousTodos, false);
      throw err;
    }
  };

  return {
    todos,
    isLoading,
    isValidating,
    error,
    mutate,
    toggleTodo,
    toggleMissionAction,
    recordMissionDiscipline,
    deleteTodo,
  };
}
