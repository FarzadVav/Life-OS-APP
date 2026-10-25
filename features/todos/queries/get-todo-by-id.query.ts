import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { serializeTodo } from '../repositories';
import type { Todo } from '../types';

/**
 * Server query for retrieving a single todo owned by the acting user.
 * Another user's id is indistinguishable from a nonexistent one.
 */
export async function getTodoByIdQuery(id: number): Promise<Todo | null> {
  const userId = await requireUserId();

  return withRequestContext(async ({ todo }) => {
    const entity = await todo.findById(id, userId);
    if (!entity) {
      return null;
    }

    return serializeTodo(entity);
  });
}
