'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeTodo } from '../repositories';
import type { Todo } from '../types';

/**
 * Server Action mutation for toggling a Todo's isDone status.
 */
export async function toggleTodoMutation(id: number): Promise<{ success: boolean; todo?: Todo }> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ todo }) => {
    let updated = await todo.toggleDone(id, userId);
    if (!updated && !userId) {
      updated = await todo.toggleDone(id);
    }

    if (!updated) {
      return { success: false };
    }

    return {
      success: true,
      todo: serializeTodo(updated),
    };
  });
}
