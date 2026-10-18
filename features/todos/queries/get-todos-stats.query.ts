import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';

export type TodosStats = {
  dailyCompleted: number;
  dailyTotal: number;
  upcomingTotal: number;
  missionsTotal: number;
};

/**
 * Server query for retrieving aggregated summary statistics for todos.
 * Uses repository pattern via withRequestContext.
 */
export async function getTodosStatsQuery(): Promise<TodosStats> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ todo }) => {
    return todo.getTodosStats(userId);
  });
}
