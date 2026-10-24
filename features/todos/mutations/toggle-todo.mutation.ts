'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
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

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ todo }) => {
    let updated = await todo.toggleDone(id, userId);
    if (!updated && !userId) {
      updated = await todo.toggleDone(id);
    }

    return updated ? { success: true } : { success: false, error: 'Todo not found' };
  });
}
