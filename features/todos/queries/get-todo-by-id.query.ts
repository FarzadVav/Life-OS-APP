import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeTodo } from '../repositories';
import type { Todo } from '../types';

/**
 * Server query for retrieving a single todo by its ID.
 * Uses repository pattern via withRequestContext.
 */
export async function getTodoByIdQuery(id: number): Promise<Todo | null> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ todo }) => {
    let entity = await todo.findById(id, userId);

    // If not found with user restriction and user was not authenticated, fallback search
    if (!entity && !userId) {
      entity = await todo.findById(id);
    }

    if (!entity) {
      return null;
    }

    return serializeTodo(entity);
  });
}
