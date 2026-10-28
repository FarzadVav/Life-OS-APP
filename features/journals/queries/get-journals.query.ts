import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { serializeJournal } from '../repositories';
import type { Journal, JournalCategory } from '../types';

/**
 * Server query for retrieving the acting user's journals, optionally filtered by
 * category and tag. Authorization is resolved here rather than trusting a caller.
 */
export async function getJournalsQuery(
  category?: JournalCategory | 'all' | string,
  tag?: string,
): Promise<Journal[]> {
  const userId = await requireUserId();

  return withRequestContext(async ({ journal }) => {
    let entities;
    if (category && category !== 'all') {
      entities = await journal.findByCategory(category, userId, tag);
    } else if (tag && tag.toLowerCase() !== 'all') {
      entities = await journal.find(
        { user: userId, tag },
        { orderBy: { createdAt: 'DESC' } },
      );
    } else {
      entities = await journal.findAllJournals(userId);
    }

    return entities.map((item) => serializeJournal(item));
  });
}
