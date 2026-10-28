'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import type { ActionResult } from '@/features/general/lib/types';

export async function deleteJournalTagMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid tag id' };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return {
      success: false,
      error: 'Your session has expired. Please sign in again.',
    };
  }

  return withRequestContext(async ({ journalTag }) => {
    const success = await journalTag.deleteTag(id, userId);
    return success
      ? { success: true }
      : { success: false, error: 'Tag not found' };
  });
}
