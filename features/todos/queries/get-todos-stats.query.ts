import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';

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
  const userId = await requireUserId();

  return withRequestContext(async ({ todo }) => {
    return todo.getTodosStats(userId);
  });
}
