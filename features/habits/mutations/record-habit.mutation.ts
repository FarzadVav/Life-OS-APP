'use server';

import { withRequestContext } from '@/db';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for recording a habit check-in (I Do / I Don't Do) for today.
 * Reads `id` from a hidden input and `isDone` from the pressed submit button.
 */
export async function recordHabitMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid habit id' };
  }

  const isDone = formData.get('isDone') !== 'false';
  const date = new Date().toISOString().slice(0, 10);

  try {
    await withRequestContext(async ({ habit }) => {
      await habit.recordHistory(id, date, isDone);
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to record habit:', error);
    return { success: false, error: 'Failed to record habit' };
  }
}
