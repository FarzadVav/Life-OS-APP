'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for recording a discipline's habit tracking history (I Do / I Don't Do).
 * Reads `id` from a hidden input and `isDone` from the pressed submit button.
 */
export async function recordDisciplineMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const disciplineId = Number(formData.get('id'));

  if (!disciplineId || Number.isNaN(disciplineId)) {
    return { success: false, error: 'Invalid discipline id' };
  }

  const isDone = formData.get('isDone') !== 'false';

  const userId = await tryGetUserId();
  if (userId === null) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }

  return withRequestContext(async ({ todoDiscipline }) => {
    const history = await todoDiscipline.recordHistory(
      disciplineId,
      new Date().toISOString(),
      isDone,
      userId,
    );

    return history
      ? { success: true }
      : { success: false, error: 'Discipline not found' };
  });
}
