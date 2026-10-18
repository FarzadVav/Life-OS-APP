import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeJournal } from '../repositories';
import type { Journal } from '../types';

/**
 * Server query for retrieving a single journal by its ID.
 * Uses repository pattern via withRequestContext.
 */
export async function getJournalByIdQuery(id: number): Promise<Journal | null> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ journal }) => {
    let entity = await journal.findById(id, userId);

    if (!entity && !userId) {
      entity = await journal.findById(id);
    }

    if (!entity) {
      return null;
    }

    return serializeJournal(entity);
  });
}
