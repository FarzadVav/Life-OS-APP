import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { FrameworkCategory } from '@/db/entities/enums';

export type FrameworkStats = {
  byCategory: Record<FrameworkCategory, number>;
  bySection: {
    visions: number;
    rules: number;
    concepts: number;
  };
  total: number;
};

/**
 * Server query for retrieving aggregated summary statistics for framework items across categories and sections.
 * Uses repository pattern via withRequestContext.
 */
export async function getFrameworkStatsQuery(): Promise<FrameworkStats> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ framework }) => {
    const [byCategory, bySection] = await Promise.all([
      framework.getCountsByCategory(userId),
      framework.getCountsBySection(userId),
    ]);

    const total = Object.values(byCategory).reduce((acc, count) => acc + count, 0);

    return {
      byCategory,
      bySection,
      total,
    };
  });
}
