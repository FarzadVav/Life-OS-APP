'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for recording a framework check-in (I Do / I Don't Do) for today.
 * Reads `id` from a hidden input and `isDone` from the pressed submit button.
 */
export async function recordFrameworkMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid framework id' };
  }

  const isDone = formData.get('isDone') !== 'false';
  const date = new Date().toISOString().slice(0, 10);

  const userId = await tryGetUserId();
  if (userId === null) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }

  try {
    const history = await withRequestContext(async ({ framework }) => {
      return await framework.recordHistory(id, date, isDone, userId);
    });

    return history ? { success: true } : { success: false, error: 'Framework not found' };
  } catch (error) {
    console.error('Failed to record framework:', error);
    return { success: false, error: 'Failed to record framework' };
  }
}
