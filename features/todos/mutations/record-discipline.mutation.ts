'use server';

import { withRequestContext } from '@/db';
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

  return withRequestContext(async ({ todoDiscipline }) => {
    await todoDiscipline.recordHistory(
      disciplineId,
      new Date().toISOString(),
      isDone,
    );
    return { success: true };
  });
}
