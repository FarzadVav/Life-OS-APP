import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeFrameworkItem } from '../repositories';
import type { FrameworkItem } from '../types';

/**
 * Server query for retrieving a single framework item by ID.
 * Uses repository pattern via withRequestContext.
 */
export async function getFrameworkItemByIdQuery(id: number): Promise<FrameworkItem | null> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ framework }) => {
    let entity = await framework.findById(id, userId);

    if (!entity && !userId) {
      entity = await framework.findById(id);
    }

    if (!entity) {
      return null;
    }

    return serializeFrameworkItem(entity);
  });
}
