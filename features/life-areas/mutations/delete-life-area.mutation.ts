'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';
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

  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ lifeArea }) => {
    const success = await lifeArea.deleteLifeArea(id, userId);
    return success
      ? { success: true }
      : { success: false, error: 'Life area not found' };
  });
}
