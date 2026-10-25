import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { serializeTodo } from '../repositories';
import type { Todo, TodoType } from '../types';

/**
 * Server query for retrieving the acting user's todos, optionally filtered by type.
 * Authorization is resolved here rather than trusting a caller.
 */
export async function getTodosQuery(type?: TodoType | 'all' | string): Promise<Todo[]> {
  const userId = await requireUserId();

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
