import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { JournalCategory } from '@/db/entities/enums';

export type JournalsStats = {
  counts: Record<JournalCategory, number>;
  total: number;
};

/**
 * Server query for retrieving aggregated summary statistics and counts for journals per category.
 * Uses repository pattern via withRequestContext.
 */
export async function getJournalsStatsQuery(): Promise<JournalsStats> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ journal }) => {
    const counts = await journal.getCategoryCounts(userId);
    const total = Object.values(counts).reduce((acc, count) => acc + count, 0);

    return { counts, total };
  });
}
