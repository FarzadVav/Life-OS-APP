'use server';

import { withRequestContext } from '@/db';

/**
 * Server Action mutation for toggling a mission action item's isDone status.
 */
export async function toggleActionMutation(actionId: number): Promise<{ success: boolean; isDone?: boolean }> {
  return withRequestContext(async ({ todoAction }) => {
    const updated = await todoAction.toggleAction(actionId);
    if (!updated) {
      return { success: false };
    }
    return { success: true, isDone: updated.isDone };
  });
}
