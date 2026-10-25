import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
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
  const userId = await requireUserId();

  return withRequestContext(async ({ journal }) => {
    const counts = await journal.getCategoryCounts(userId);
    const total = Object.values(counts).reduce((acc, count) => acc + count, 0);

    return { counts, total };
  });
}
