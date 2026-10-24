'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for deleting a habit.
 * Reads the target id from the submitted form (hidden input).
 */
export async function deleteHabitMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid habit id' };
  }

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  try {
    await withRequestContext(async ({ habit }) => {
      await habit.deleteHabit(id, userId);
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete habit:', error);
    return { success: false, error: 'Failed to delete habit' };
  }
}
