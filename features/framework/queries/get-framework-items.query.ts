import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeFrameworkItem } from '../repositories';
import type { FrameworkItem, FrameworkCategory, FrameworkSection } from '../types';

/**
 * Server query for retrieving framework items filtered by optional category and section.
 * Uses repository pattern via withRequestContext.
 */
export async function getFrameworkItemsQuery(
  category?: FrameworkCategory | 'all' | string,
  section?: FrameworkSection | 'all' | string,
): Promise<FrameworkItem[]> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ framework }) => {
    const entities = await framework.findByCategoryAndSection(
      category,
      section,
      userId,
    );

    return entities.map((item) => serializeFrameworkItem(item));
  });
}
