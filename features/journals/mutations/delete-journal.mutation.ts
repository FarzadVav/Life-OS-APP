'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';

/**
 * Server Action mutation for deleting a Journal entry.
 */
export async function deleteJournalMutation(id: number): Promise<{ success: boolean }> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ journal }) => {
    let success = await journal.deleteJournal(id, userId);
    if (!success && !userId) {
      success = await journal.deleteJournal(id);
    }
    return { success };
  });
}
