'use server';

import { withRequestContext } from '@/db';

/**
 * Server Action mutation for recording a discipline's habit tracking history (I Do / I Don't Do).
 */
export async function recordDisciplineMutation(
  disciplineId: number,
  isDone = true,
  date?: string,
): Promise<{ success: boolean }> {
  const recordDate = date ?? new Date().toISOString();

  return withRequestContext(async ({ todoDiscipline }) => {
    await todoDiscipline.recordHistory(disciplineId, recordDate, isDone);
    return { success: true };
  });
}
