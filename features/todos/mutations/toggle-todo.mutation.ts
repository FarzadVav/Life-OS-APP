'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for toggling a Todo's isDone status.
 * Reads the target id from the submitted form (hidden input).
 */
export async function toggleTodoMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid todo id' };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }

  return withRequestContext(async ({ todo }) => {
    const updated = await todo.toggleDone(id, userId);

    return updated ? { success: true } : { success: false, error: 'Todo not found' };
  });
}
