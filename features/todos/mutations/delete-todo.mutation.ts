'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';

/**
 * Server Action mutation for deleting a Todo.
 */
export async function deleteTodoMutation(id: number): Promise<{ success: boolean }> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ todo }) => {
    let success = await todo.deleteTodo(id, userId);
    if (!success && !userId) {
      success = await todo.deleteTodo(id);
    }
    return { success };
  });
}
