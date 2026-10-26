'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
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

  const userId = await tryGetUserId();
  if (userId === null) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }

  try {
    const success = await withRequestContext(async ({ habit }) => {
      return await habit.deleteHabit(id, userId);
    });
    return success ? { success: true } : { success: false, error: 'Habit not found' };
  } catch (error) {
    console.error('Failed to delete habit:', error);
    return { success: false, error: 'Failed to delete habit' };
  }
}
