import 'server-only';
import { withRequestContext } from '@/db';
import { requireUserId } from '@/features/auth/lib/actor';
import { serializeJournal } from '../repositories';
import type { Journal } from '../types';

/**
 * Server query for retrieving a single journal owned by the acting user.
 * Another user's id is indistinguishable from a nonexistent one.
 */
export async function getJournalByIdQuery(id: number): Promise<Journal | null> {
  const userId = await requireUserId();

  return withRequestContext(async ({ journal }) => {
    const entity = await journal.findById(id, userId);
    if (!entity) {
      return null;
    }

    return serializeJournal(entity);
  });
}
