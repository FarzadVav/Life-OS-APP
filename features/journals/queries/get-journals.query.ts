import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { serializeJournal } from '../repositories';
import type { Journal, JournalCategory } from '../types';

/**
 * Server query for retrieving the acting user's journals, optionally filtered by
 * category. Authorization is resolved here rather than trusting a caller.
 */
export async function getJournalsQuery(category?: JournalCategory | 'all' | string): Promise<Journal[]> {
  const userId = await requireUserId();

  return withRequestContext(async ({ journal }) => {
    const entities =
      category && category !== 'all'
        ? await journal.findByCategory(category, userId)
        : await journal.findAllJournals(userId);

    return entities.map((item) => serializeJournal(item));
  });
}
