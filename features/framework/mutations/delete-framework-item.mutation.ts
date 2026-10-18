'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';

/**
 * Server Action mutation for deleting a Framework item.
 */
export async function deleteFrameworkItemMutation(id: number): Promise<{ success: boolean }> {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  return withRequestContext(async ({ framework }) => {
    let success = await framework.deleteItem(id, userId);
    if (!success && !userId) {
      success = await framework.deleteItem(id);
    }
    return { success };
  });
}
