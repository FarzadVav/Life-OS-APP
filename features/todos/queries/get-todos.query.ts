import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeTodo } from '../repositories';
import type { Todo, TodoType } from '../types';

/**
 * Server query for retrieving todos list filtered by optional type.
 * Uses repository pattern via withRequestContext.
 */
export async function getTodosQuery(type?: TodoType | 'all' | string): Promise<Todo[]> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ todo }) => {
    let entities;

    if (type === 'Daily') {
      entities = await todo.findDaily(userId);
    } else if (type === 'Upcoming') {
      entities = await todo.findUpcoming(userId);
    } else if (type === 'Mission') {
      entities = await todo.findMissions(userId, { populateRelations: true });
    } else {
      entities = await todo.findAllTodos(userId);
    }

    return entities.map((item) => serializeTodo(item));
  });
}
