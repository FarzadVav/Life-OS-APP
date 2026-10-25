'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for toggling a mission action item's isDone status.
 * Reads the target id from the submitted form (hidden input).
 */
export async function toggleActionMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const actionId = Number(formData.get('id'));

  if (!actionId || Number.isNaN(actionId)) {
    return { success: false, error: 'Invalid action id' };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }

  return withRequestContext(async ({ todoAction }) => {
    const updated = await todoAction.toggleAction(actionId, userId);

    return updated
      ? { success: true }
      : { success: false, error: 'Action not found' };
  });
}
