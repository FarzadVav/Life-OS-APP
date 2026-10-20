'use server';

import { withRequestContext } from '@/db';
import { getSessionQuery } from '@/features/auth/queries';

export async function deleteHabitMutation(id: number) {
  const session = await getSessionQuery();
  const userId = session?.userId ? Number(session.userId) : undefined;

  try {
    await withRequestContext(async ({ habit }) => {
      await habit.deleteHabit(id, userId);
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete habit:', error);
    return { success: false, error: 'Failed to delete habit' };
  }
}
