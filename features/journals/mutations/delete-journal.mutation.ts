'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for deleting a Journal entry.
 * Reads the target id from the submitted form (hidden input).
 */
export async function deleteJournalMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid journal id' };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ journal }) => {
    let success = await journal.deleteJournal(id, userId);
    if (!success && !userId) {
      success = await journal.deleteJournal(id);
    }
    return success ? { success: true } : { success: false, error: 'Journal not found' };
  });
}
