'use server';

import { withRequestContext } from '@/db';
import { tryGetUserId } from '@/features/auth/lib/actor';
import type { ActionResult } from '@/features/general/lib/types';

/**
 * Server Action mutation for deleting a Life Area.
 * Reads the target id from the submitted form (hidden input).
 */
export async function deleteLifeAreaMutation(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = Number(formData.get('id'));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: 'Invalid life area id' };
  }

  const userId = await tryGetUserId();
  if (userId === null) {
    return { success: false, error: 'Your session has expired. Please sign in again.' };
  }

  return withRequestContext(async ({ lifeArea }) => {
    const success = await lifeArea.deleteLifeArea(id, userId);
    return success
      ? { success: true }
      : { success: false, error: 'Life area not found' };
  });
}
