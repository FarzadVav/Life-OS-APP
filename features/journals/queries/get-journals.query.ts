import 'server-only';
import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import { serializeJournal } from '../repositories';
import type { Journal, JournalCategory } from '../types';

/**
 * Server query for retrieving journals list filtered by optional category.
 * Uses repository pattern via withRequestContext.
 */
export async function getJournalsQuery(category?: JournalCategory | 'all' | string): Promise<Journal[]> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ journal }) => {
    let entities;

    if (category && category !== 'all') {
      entities = await journal.findByCategory(category, userId);
    } else {
      entities = await journal.findAllJournals(userId);
    }

    return entities.map((item) => serializeJournal(item));
  });
}
