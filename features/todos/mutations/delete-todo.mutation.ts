'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for deleting a Todo.
 * Reads the target id from the submitted form (hidden input).
 */
export async function deleteTodoMutation(
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
    let success = await todo.deleteTodo(id, userId);
    if (!success && !userId) {
      success = await todo.deleteTodo(id);
    }
    return success ? { success: true } : { success: false, error: 'Todo not found' };
  });
}
